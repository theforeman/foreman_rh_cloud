import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid } from 'patternfly-react';
import './scheduledRun.scss';

const ScheduledRun = ({ time }) => (
  <Grid.Col sm={12}>
    <p>
      <Icon name="calendar" size="2x" />
      Next report generating is scheduled to run on {time}
    </p>
  </Grid.Col>
);

ScheduledRun.propTypes = {
  time: PropTypes.string,
};

ScheduledRun.defaultProps = {
  time: '00:00',
};

export default ScheduledRun;
