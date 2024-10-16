import React from 'react';
import PropTypes from 'prop-types';
import InsightsTotalRiskChart from './InsightsTotalRiskChart';
import { isNotRhelHost } from '../ForemanRhCloudHelpers';

export const InsightsTotalRiskChartWrapper = props => {
  if (props.status === 'RESOLVED') {
    return (
      !isNotRhelHost(props.hostDetails) && <InsightsTotalRiskChart {...props} /> // check for RHEL hosts
    );
  }
  return null;
};

InsightsTotalRiskChartWrapper.propTypes = {
  status: PropTypes.string,
  hostDetails: PropTypes.object,
};

InsightsTotalRiskChartWrapper.defaultProps = {
  status: 'PENDING',
  hostDetails: {},
};
