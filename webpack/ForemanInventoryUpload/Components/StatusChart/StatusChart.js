import React from 'react';
import PropTypes from 'prop-types';
import { Grid, DonutChart } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import './statusChart.scss';

const StatusChart = ({ completed }) => {
  const donutConfigData = {
    columns: [
      [__('Completed'), completed],
      [__('Remain'), 100 - completed],
    ],
    order: null,
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
          id="donut-chart-1"
          size={{
            width: 210,
            height: 210,
          }}
          data={donutConfigData}
          tooltip={donutConfigTooltip}
          title={{
            type: 'percent',
            primary: `${completed}%`,
            secondary: __('Completed'),
          }}
        />
      </div>
    </Grid.Col>
  );
};

StatusChart.propTypes = {
  completed: PropTypes.number,
};

StatusChart.defaultProps = {
  completed: 0,
};

export default StatusChart;
