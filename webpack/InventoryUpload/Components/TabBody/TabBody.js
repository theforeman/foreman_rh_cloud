import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import Terminal from '../Terminal';

const TabBody = ({ exitCode, logs, error }) => (
  <Grid.Row>
    <Terminal logs={logs} exitCode={exitCode} error={error} />
  </Grid.Row>
);

TabBody.propTypes = {
  exitCode: PropTypes.string,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  error: PropTypes.string,
};

TabBody.defaultProps = {
  exitCode: '',
  logs: null,
  error: null,
};
export default TabBody;
