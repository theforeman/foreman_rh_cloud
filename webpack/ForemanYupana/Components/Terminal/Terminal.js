import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Spinner, noop } from 'patternfly-react';
import './terminal.scss';

class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.terminal = React.createRef();
  }

  componentDidMount() {
    this.props.getLogs();
  }

  componentDidUpdate() {
    const element = this.terminal.current;
    element.scrollTop = element.scrollHeight;
  }
  render() {
    const { logs } = this.props;
    const modifiedLogs =
      logs.length > 0 && logs.map((log, index) => <p key={index}>{log}</p>);
    return (
      <Grid.Col sm={8}>
        <div className="terminal" ref={this.terminal}>
          <Grid fluid>
            <Grid.Row>
              <Grid.Col sm={12}>
                {modifiedLogs}
                <Spinner loading={logs.length > 1} inverse inline size="xs" />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
      </Grid.Col>
    );
  }
}

Terminal.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.string),
  getLogs: PropTypes.func,
};

Terminal.defaultProps = {
  logs: ['No running process'],
  getLogs: noop,
};

export default Terminal;
