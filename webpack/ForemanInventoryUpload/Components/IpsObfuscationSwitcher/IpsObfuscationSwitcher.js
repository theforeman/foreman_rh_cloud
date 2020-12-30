import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import SwitcherPF4 from '../../../common/Switcher/SwitcherPF4';

const IpsObfuscationSwitcher = ({ ipsObfuscationEnabled, handleToggle }) => (
  <div className="ips_obfuscation_switcher">
    <SwitcherPF4
      id="ips-obfuscation-settings-switcher"
      label={__('Obfuscate host ipv4 addresses')}
      tooltip={__('Obfuscate ipv4 addresses sent to the Red Hat cloud')}
      isChecked={ipsObfuscationEnabled}
      onChange={() => handleToggle(ipsObfuscationEnabled)}
    />
  </div>
);

IpsObfuscationSwitcher.propTypes = {
  ipsObfuscationEnabled: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
};

IpsObfuscationSwitcher.defaultProps = {
  ipsObfuscationEnabled: false,
};

export default IpsObfuscationSwitcher;
