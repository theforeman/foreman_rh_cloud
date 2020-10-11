import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FieldLevelHelp } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import './HostObfuscationSwitcher.scss';

const HostObfuscationSwitcher = ({ hostObfuscationEnabled, handleToggle }) => (
  <div className="host_obfuscation_switcher">
    <span>Obfuscate host names</span>
    <FieldLevelHelp
      content={__('Obfuscate host names sent to the Red Hat cloud')}
    />
    <Switch
      size="mini"
      value={hostObfuscationEnabled}
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
