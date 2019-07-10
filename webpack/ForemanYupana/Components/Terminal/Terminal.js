import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import './terminal.scss';

const Terminal = ({ children }) => {
  const logs =
    children && children.map((log, index) => <p key={index}>{log}</p>);
  return (
    <Grid.Col sm={8}>
      <div className="terminal">
        <Grid fluid>
          <Grid.Row>
            <Grid.Col sm={12}>{logs}</Grid.Col>
          </Grid.Row>
        </Grid>
      </div>
    </Grid.Col>
  );
};

Terminal.propTypes = {
  children: PropTypes.node,
};

Terminal.defaultProps = {
  children: null,
};

export default Terminal;
