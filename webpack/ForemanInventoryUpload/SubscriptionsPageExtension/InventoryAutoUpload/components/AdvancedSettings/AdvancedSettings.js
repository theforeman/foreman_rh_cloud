import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import Switcher from '../../../../../common/Switcher';

const AdvancedSettings = ({
  hostObfuscationEnabled,
  hostObfuscationToggle,
  ipsObfuscationEnabled,
  ipsObfuscationToggle,
  excludePackagesEnabled,
  excludePackagesToggle,
}) => (
  <form style={{ padding: '5px' }}>
    <Grid.Row>
      <Switcher
        id="obfuscate-hostnames"
        label={__('Obfuscate host names')}
        tooltip={__('Obfuscate host names sent to the Red Hat cloud')}
        isChecked={hostObfuscationEnabled}
        onChange={() => hostObfuscationToggle(hostObfuscationEnabled)}
        labelCol={8}
      />
    </Grid.Row>
    <Grid.Row>
      <Switcher
        id="obfuscate-ip"
        label={__('Obfuscate IPs')}
        tooltip={__('Obfuscate ipv4 addresses sent to the Red Hat cloud')}
        isChecked={ipsObfuscationEnabled}
        onChange={() => ipsObfuscationToggle(ipsObfuscationEnabled)}
        labelCol={8}
      />
    </Grid.Row>
    <Grid.Row>
      <Switcher
        id="exclude-packages"
        label={__('Exclude packages')}
        tooltip={__(
          'Exclude packages from being uploaded to the Red Hat cloud'
        )}
        isChecked={excludePackagesEnabled}
        onChange={() => excludePackagesToggle(excludePackagesEnabled)}
        labelCol={8}
      />
    </Grid.Row>
  </form>
);

AdvancedSettings.propTypes = {
  hostObfuscationEnabled: PropTypes.bool.isRequired,
  hostObfuscationToggle: PropTypes.func.isRequired,
  ipsObfuscationEnabled: PropTypes.bool.isRequired,
  ipsObfuscationToggle: PropTypes.func.isRequired,
  excludePackagesEnabled: PropTypes.bool.isRequired,
  excludePackagesToggle: PropTypes.func.isRequired,
};

export default AdvancedSettings;
