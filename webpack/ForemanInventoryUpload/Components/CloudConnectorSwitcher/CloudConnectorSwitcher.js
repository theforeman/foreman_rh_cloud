import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import ShortSwitcherPF4 from '../../../common/Switcher/ShortSwitcherPF4';

const CloudConnectorSwitcher = ({ isEnabled, handleToggle }) => (
  <ShortSwitcherPF4
    id="cloud-connector-settings-switcher"
    label={__('Cloud Connector')}
    isChecked={isEnabled}
    onChange={handleToggle}
  />
);

CloudConnectorSwitcher.propTypes = {
  isEnabled: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
};

CloudConnectorSwitcher.defaultProps = {
  isEnabled: false,
};

export default CloudConnectorSwitcher;
