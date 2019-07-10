import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';

const TabFooter = ({ children }) => (
  <Grid.Row>
    <div className="tab-footer">{children}</div>
  </Grid.Row>
);

TabFooter.propTypes = {
  children: PropTypes.node,
};

TabFooter.defaultProps = {
  children: null,
};

export default TabFooter;
