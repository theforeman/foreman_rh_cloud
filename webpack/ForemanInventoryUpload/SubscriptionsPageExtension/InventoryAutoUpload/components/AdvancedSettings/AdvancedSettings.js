import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import Switcher from '../../../../../common/Switcher';
import { settingsDict } from '../../../../Components/InventorySettings/AdvancedSetting/AdvancedSettingsConstants';

const AdvancedSettings = ({
  setSetting,
  hostObfuscationEnabled,
  ipsObfuscationEnabled,
  excludePackagesEnabled,
}) => (
  <form style={{ padding: '5px' }}>
    <Grid.Row>
      <Switcher
        id="obfuscate-hostnames"
        label={__('Obfuscate host names')}
        tooltip={__('Obfuscate host names sent to the Red Hat cloud')}
        isChecked={hostObfuscationEnabled}
        onChange={() =>
          setSetting({
            setting: settingsDict.hostObfuscationEnabled.name,
            value: !hostObfuscationEnabled,
          })
        }
        labelCol={8}
      />
    </Grid.Row>
    <Grid.Row>
      <Switcher
        id="obfuscate-ip"
        label={__('Obfuscate IPs')}
        tooltip={__('Obfuscate ipv4 addresses sent to the Red Hat cloud')}
        isChecked={ipsObfuscationEnabled}
        onChange={() =>
          setSetting({
            setting: settingsDict.ipsObfuscationEnabled.name,
            value: !ipsObfuscationEnabled,
          })
        }
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
        onChange={() =>
          setSetting({
            setting: settingsDict.excludePackagesEnabled.name,
            value: !excludePackagesEnabled,
          })
        }
        labelCol={8}
      />
    </Grid.Row>
  </form>
);

AdvancedSettings.propTypes = {
  setSetting: PropTypes.func.isRequired,
  hostObfuscationEnabled: PropTypes.bool.isRequired,
  ipsObfuscationEnabled: PropTypes.bool.isRequired,
  excludePackagesEnabled: PropTypes.bool.isRequired,
};

export default AdvancedSettings;
