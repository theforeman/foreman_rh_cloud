import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Spinner } from 'patternfly-react';
import './terminal.scss';

class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.terminal = React.createRef();
  }

  componentDidUpdate() {
    this.handleScroll();
  }

  handleScroll = () => {
    const { autoScroll } = this.props;
    if (autoScroll) {
      const element = this.terminal.current;
      element.scrollTop = element.scrollHeight;
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
        <div className="terminal" ref={this.terminal}>
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
