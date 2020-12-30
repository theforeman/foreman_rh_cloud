import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import SwitcherPF4 from '../../../common/Switcher/SwitcherPF4';

const HostObfuscationSwitcher = ({ hostObfuscationEnabled, handleToggle }) => (
  <div className="host_obfuscation_switcher">
    <SwitcherPF4
      id="host-obfuscation-setting-switcher"
      label={__('Obfuscate host names')}
      tooltip={__('Obfuscate host names sent to the Red Hat cloud')}
      isChecked={hostObfuscationEnabled}
      onChange={() => handleToggle(hostObfuscationEnabled)}
    />
  </div>
);

HostObfuscationSwitcher.propTypes = {
  hostObfuscationEnabled: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
};

HostObfuscationSwitcher.defaultProps = {
  hostObfuscationEnabled: false,
};

export default HostObfuscationSwitcher;
