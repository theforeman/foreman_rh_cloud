import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Grid } from 'patternfly-react';
import './statusChart.scss';

const StatusChart = ({ percentage }) => (
  <Grid.Col sm={4}>
    <div className="status-chart">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={5}
      />
    </div>
  </Grid.Col>
);

StatusChart.propTypes = {
  percentage: PropTypes.number,
};

StatusChart.defaultProps = {
  percentage: 0,
};

export default StatusChart;
