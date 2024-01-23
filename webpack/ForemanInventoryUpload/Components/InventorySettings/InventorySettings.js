import React from 'react';
import AdvancedSetting from './AdvancedSetting';
import { settingsDict } from './AdvancedSetting/AdvancedSettingsConstants';

import './InventorySettings.scss';

const InventorySettings = () => (
  <div className="inventory-settings">
    {Object.keys(settingsDict).map(key => (
      <AdvancedSetting setting={key} key={key} />
    ))}
  </div>
);

export default InventorySettings;
