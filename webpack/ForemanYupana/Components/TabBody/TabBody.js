import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';
import StatusChart from '../StatusChart';

const TabBody = ({ loading, logs, completed, error }) => (
  <Grid.Row>
    <StatusChart completed={completed} />
    <Terminal logs={logs} loading={loading} error={error} />
  </Grid.Row>
);

TabBody.propTypes = {
  loading: PropTypes.bool,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  completed: PropTypes.number,
  error: PropTypes.string,
};

TabBody.defaultProps = {
  loading: false,
  logs: ['No running process'],
  completed: 0,
  error: null,
};
export default TabBody;
