import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';

import AdvancedSetting from './AdvancedSetting';
import { settingsDict } from './AdvancedSetting/AdvancedSettingsConstants';

import './InventorySettings.scss';

const InventorySettings = () => (
  <div className="inventory-settings">
    <h3>{__('Settings')}</h3>
    {Object.keys(settingsDict).map(key => (
      <AdvancedSetting setting={key} key={key} />
    ))}
  </div>
);

export default InventorySettings;
