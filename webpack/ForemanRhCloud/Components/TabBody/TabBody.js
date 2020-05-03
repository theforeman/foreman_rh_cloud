import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';
import ScheduledRun from '../ScheduledRun';
import './tabBody.scss';

const TabBody = ({ exitCode, logs, error, scheduled }) => (
  <Grid.Row className="tab_body">
    <Terminal logs={logs} exitCode={exitCode} error={error} />
    <ScheduledRun date={scheduled} />
  </Grid.Row>
);

TabBody.propTypes = {
  exitCode: PropTypes.string,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  error: PropTypes.string,
  scheduled: PropTypes.string,
};

TabBody.defaultProps = {
  exitCode: '',
  logs: null,
  error: null,
  scheduled: null,
};
export default TabBody;
