import React from 'react';
import PropTypes from 'prop-types';
import { noop, Grid, Button } from 'patternfly-react';
import './tabHeader.scss';

const TabHeader = ({ exitCode, onRestart }) => (
  <Grid.Row className="tab-header">
    <Grid.Col sm={8}>
      <h1># Exit Code: {exitCode}</h1>
    </Grid.Col>
    <Grid.Col sm={4}>
      <Button bsStyle="primary" onClick={onRestart}>
        Restart
      </Button>
    </Grid.Col>
  </Grid.Row>
);

TabHeader.propTypes = {
  onRestart: PropTypes.func,
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TabHeader.defaultProps = {
  onRestart: noop,
  exitCode: '',
};

export default TabHeader;
