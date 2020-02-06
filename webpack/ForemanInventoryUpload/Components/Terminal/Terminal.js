import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Spinner } from 'patternfly-react';
import { isEqual } from 'lodash';
import './terminal.scss';
import { isTerminalScrolledDown } from './TerminalHelper';

class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.terminal = React.createRef();
    this.state = {
      didUserScroll: false,
    };
  }

  componentDidMount() {
    this.scrollBottom();
  }

  componentDidUpdate({ logs: prevLogs }) {
    const { logs: currentLogs, autoScroll } = this.props;
    const { didUserScroll } = this.state;
    if (autoScroll && !didUserScroll && !isEqual(prevLogs, currentLogs)) {
      this.scrollBottom();
    }
  }

  handleScroll = e => {
    const { scrollTop, scrollHeight, offsetHeight } = e.target;
    const didUserScroll = isTerminalScrolledDown(
      scrollHeight,
      scrollTop,
      offsetHeight,
      100
    );
    this.setState({
      didUserScroll,
    });
  };

  scrollBottom = () => {
    const element = this.terminal.current;
    if (!element) {
      return;
    }
    const setHeightToBottom = () => {
      element.scrollTop = element.scrollHeight;
    };
    /** happens on tab switching when the terminal wasn't visible yet
     * and there was nothing to scroll, 250ms is enough to wait for the terminal to appear.
     */
    if (element.scrollHeight === 0) {
      setTimeout(setHeightToBottom, 250);
    } else {
      setHeightToBottom();
    }
  };

  render() {
    const { logs, error, exitCode } = this.props;
    let modifiedLogs = null;
    if (error !== null) {
      modifiedLogs = <p className="terminal_error">{error}</p>;
    } else if (Array.isArray(logs)) {
      modifiedLogs = logs.map((log, index) => <p key={index}>{log}</p>);
    } else {
      modifiedLogs = <p>{logs}</p>;
    }
    const exitCodeLowerCase = exitCode.toLowerCase();
    const loading =
      exitCodeLowerCase.indexOf('running') !== -1 ||
      exitCodeLowerCase.indexOf('restarting') !== -1;
    return (
      <Grid.Col sm={12}>
        <div
          className="terminal"
          ref={this.terminal}
          onScroll={this.handleScroll}
        >
          <Grid fluid>
            <Grid.Row>
              <Grid.Col sm={12}>
                {modifiedLogs}
                <Spinner loading={loading} inverse inline size="xs" />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
      </Grid.Col>
    );
  }
}

Terminal.propTypes = {
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  error: PropTypes.string,
  exitCode: PropTypes.string,
  autoScroll: PropTypes.bool,
};

Terminal.defaultProps = {
  logs: null,
  error: null,
  exitCode: '',
  autoScroll: true,
};

export default Terminal;
