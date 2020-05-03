import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import './tabContainer.scss';

const TabContainer = ({ children, className }) => (
  <div className={className}>
    <Grid>
      <Grid.Col>{children}</Grid.Col>
    </Grid>
  </div>
);

TabContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TabContainer.defaultProps = {
  children: null,
  className: '',
};

export default TabContainer;
