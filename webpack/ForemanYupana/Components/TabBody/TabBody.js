import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';
import StatusChart from '../StatusChart';

const TabBody = ({ loading, logs, completed }) => (
  <Grid.Row>
    <StatusChart completed={completed} />
    <Terminal logs={logs} loading={loading} />
  </Grid.Row>
);

TabBody.propTypes = {
  loading: PropTypes.bool,
  logs: PropTypes.arrayOf(PropTypes.string),
  completed: PropTypes.number,
};

TabBody.defaultProps = {
  loading: false,
  logs: ['No running process'],
  completed: 0,
};
export default TabBody;
