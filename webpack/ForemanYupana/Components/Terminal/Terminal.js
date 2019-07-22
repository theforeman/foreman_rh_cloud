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
    const element = this.terminal.current;
    element.scrollTop = element.scrollHeight;
  };

  render() {
    const { loading, logs } = this.props;
    const modifiedLogs =
      logs.length > 0 && logs.map((log, index) => <p key={index}>{log}</p>);
    return (
      <Grid.Col sm={8}>
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
  logs: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};

Terminal.defaultProps = {
  logs: ['No running process'],
  loading: false,
};

export default Terminal;
