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
    const element = this.terminal.current;
    element.scrollTop = element.scrollHeight;
  }
  render() {
    const { children } = this.props;
    const logs =
      children && children.map((log, index) => <p key={index}>{log}</p>);
    return (
      <Grid.Col sm={8}>
        <div className="terminal" ref={this.terminal}>
          <Grid fluid>
            <Grid.Row>
              <Grid.Col sm={12}>
                {logs}
                <Spinner loading={logs && logs.length > 1} inverse inline size="xs" />
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </div>
      </Grid.Col>
    );
  }
}

Terminal.propTypes = {
  children: PropTypes.node,
};

Terminal.defaultProps = {
  children: null,
};

export default Terminal;
