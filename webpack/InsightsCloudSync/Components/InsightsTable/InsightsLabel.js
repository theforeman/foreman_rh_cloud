import React from 'react';
import {
  AngleDoubleDownIcon,
  AngleDoubleUpIcon,
  CriticalRiskIcon,
  EqualsIcon,
} from '@patternfly/react-icons';
import { Label } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

const VALUE_TO_STATE = {
  1: { icon: <AngleDoubleDownIcon />, text: __('Low'), color: 'blue' },
  2: { icon: <EqualsIcon />, text: __('Moderate'), color: 'yellow' },
  3: { icon: <AngleDoubleUpIcon />, text: __('Important'), color: 'orange' },
  4: { icon: <CriticalRiskIcon />, text: __('Critical'), color: 'red' },
};

const InsightsLabel = ({ value = 1, text, hideIcon, ...props }) => (
  <Label
    {...props}
    color={VALUE_TO_STATE[value]?.color}
    icon={!hideIcon && VALUE_TO_STATE[value]?.icon}
  >
    {text || VALUE_TO_STATE[value]?.text}
  </Label>
);

InsightsLabel.propTypes = {
  value: PropTypes.oneOf([1, 2, 3, 4]),
  text: PropTypes.string,
  hideIcon: PropTypes.bool,
};

InsightsLabel.defaultProps = {
  value: 1,
  text: '',
  hideIcon: false,
};

export default InsightsLabel;
