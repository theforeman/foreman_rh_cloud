import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import AutoUploadSwitcher from '../AutoUploadSwitcher';
import HostObfuscationSwitcher from '../HostObfuscationSwitcher';
import ExcludePackagesSwitcher from '../ExcludePackagesSwitcher';
import IpsObfuscationSwitcher from '../IpsObfuscationSwitcher';
import './inventorySettings.scss';

const InventorySettings = () => (
  <div className="inventory_settings">
    <h3>{__('Settings')}</h3>
    <AutoUploadSwitcher />
    <ExcludePackagesSwitcher />
    <HostObfuscationSwitcher />
    <IpsObfuscationSwitcher />
  </div>
);

export default InventorySettings;
