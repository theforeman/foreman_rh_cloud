import React from 'react';
import PropTypes from 'prop-types';
import { Grid, DonutChart } from 'patternfly-react';
import './statusChart.scss';

const StatusChart = ({ percentage }) => {
  const donutConfigData = {
    columns: [['Completed', percentage], ['Remain', 100 - percentage]],
    order: 'asc',
  };

  const pfGetUtilizationDonutTooltipContents = d => {
    const {
      0: { name, value },
    } = d;
    return `<span class="donut-tooltip-pf" style="white-space: nowrap;">${value}% ${name}</span>`;
  };

  const donutConfigTooltip = {
    contents: pfGetUtilizationDonutTooltipContents,
  };

  return (
    <Grid.Col sm={4}>
      <div className="status-chart">
        <DonutChart
          id="donunt-chart-1"
          size={{
            width: 210,
            height: 210,
          }}
          data={donutConfigData}
          tooltip={donutConfigTooltip}
          title={{
            type: 'percent',
            primary: `${percentage}%`,
            secondary: 'Completed',
          }}
        />
      </div>
    </Grid.Col>
  );
};

StatusChart.propTypes = {
  percentage: PropTypes.number,
};

StatusChart.defaultProps = {
  percentage: 0,
};

export default StatusChart;
