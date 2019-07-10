import React from 'react';
import PropTypes from 'prop-types';
import { noop, Grid, Button } from 'patternfly-react';
import './tabHeader.scss';

const TabHeader = ({ exitCode, onRestartClick }) => (
  <Grid.Row className="tab-header">
    <Grid.Col sm={4}>
      <h1># Exit Code: {exitCode}</h1>
    </Grid.Col>
    <Grid.Col sm={4} smOffset={4}>
      <Button bsStyle="primary" onClick={onRestartClick}>
        Restart
      </Button>
    </Grid.Col>
  </Grid.Row>
);

TabHeader.propTypes = {
  onRestartClick: PropTypes.func,
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TabHeader.defaultProps = {
  onRestartClick: noop,
  exitCode: '',
};

export default TabHeader;
