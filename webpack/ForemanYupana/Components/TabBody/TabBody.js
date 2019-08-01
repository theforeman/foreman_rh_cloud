import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';

const TabBody = ({ loading, logs, error }) => (
  <Grid.Row>
    <Terminal logs={logs} loading={loading} error={error} />
  </Grid.Row>
);

TabBody.propTypes = {
  loading: PropTypes.bool,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  error: PropTypes.string,
};

TabBody.defaultProps = {
  loading: false,
  logs: null,
  error: null,
};
export default TabBody;
