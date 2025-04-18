import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { Flex, FlexItem } from '@patternfly/react-core';

import AdvancedSetting from './AdvancedSetting';
import {
  childSettingsDict,
  settingsDict,
} from './AdvancedSetting/AdvancedSettingsConstants';
import {
  selectSubscriptionConnectionEnabled,
  selectInsightsMinimalDataCollection,
} from './InventorySettingsSelectors'; // Make sure this path is correct!
import MinimalInventoryDropdown from './MinimalInventoryDropdown';

import './InventorySettings.scss';

const InventorySettings = () => {
  const subscriptionConnectionEnabled = useSelector(
    state => selectSubscriptionConnectionEnabled(state) // Added (state) =>
  );
  const insightsMinimalDataCollection = useSelector(
    state => selectInsightsMinimalDataCollection(state) // Added (state) =>
  );
  const [chosenValue, setChosenValue] = useState(null);
  const settingKeys = new Set(Object.keys(settingsDict));

  if (!subscriptionConnectionEnabled) {
    settingKeys.delete('autoUploadEnabled');
  }

  return (
    <div className="inventory-settings">
      <h3>{__('Settings')}</h3>
      {[...settingKeys].map(key => {
        const isChildSetting = Object.hasOwnProperty.call(
          childSettingsDict,
          key
        );
        return (
          <AdvancedSetting
            key={key}
            setting={key}
            settingsDict={isChildSetting ? childSettingsDict : settingsDict}
            isLocked={
              isChildSetting &&
              (chosenValue === 'minimal' || insightsMinimalDataCollection)
            }
          />
        );
      })}
      <MinimalInventoryDropdown setChosenValue={setChosenValue} />
      {Object.keys(childSettingsDict).length > 0 && ( // Only render this section if there are child settings
        <div style={{ marginTop: '1.5em' }}>
          <Flex>
            <FlexItem>
              <span style={{ width: '6em' }} />
            </FlexItem>
            <FlexItem>
              {Object.keys(childSettingsDict).map(key => (
                <AdvancedSetting
                  key={key}
                  setting={key}
                  settingsDict={childSettingsDict}
                  isLocked={
                    chosenValue === 'minimal' || insightsMinimalDataCollection
                  }
                />
              ))}
            </FlexItem>
          </Flex>
        </div>
      )}
    </div>
  );
};

export default InventorySettings;
