import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FieldLevelHelp } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';

const IpsObfuscationSwitcher = ({ ipsObfuscationEnabled, handleToggle }) => (
  <div className="ips_obfuscation_switcher">
    <span>Obfuscate host ipv4 addresses</span>
    <FieldLevelHelp
      content={__('Obfuscate ipv4 addresses sent to the Red Hat cloud')}
    />
    <Switch
      size="mini"
      value={ipsObfuscationEnabled}
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
