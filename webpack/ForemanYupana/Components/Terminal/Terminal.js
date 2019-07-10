import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import './terminal.scss';

const Terminal = ({ children }) => (
  <Grid.Row>
    <Grid.Col sm={12}>
      <div className="terminal">
        <Grid fluid>
          <Grid.Row>
            <Grid.Col sm={12}>{children}</Grid.Col>
          </Grid.Row>
        </Grid>
      </div>
    </Grid.Col>
  </Grid.Row>
);

Terminal.propTypes = {
  children: PropTypes.node,
};

Terminal.defaultProps = {
  children: null,
};

export default Terminal;
