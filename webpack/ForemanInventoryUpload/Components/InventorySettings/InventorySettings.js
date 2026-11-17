import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { Flex, FlexItem, Title } from '@patternfly/react-core';

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
  const minimalDataCollectionSelected =
    chosenValue === 'minimal' ||
    (!chosenValue && insightsMinimalDataCollection);
  const settingKeys = new Set(Object.keys(settingsDict));

  if (!subscriptionConnectionEnabled) {
    settingKeys.delete('autoUploadEnabled');
  }

  return (
    <div className="inventory-settings">
      <Title headingLevel="h3" size="lg" ouiaId="inventory-settings-title">
        {__('Settings')}
      </Title>
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
      {!minimalDataCollectionSelected &&
        Object.keys(childSettingsDict).length > 0 && (
          <div className="child-settings">
            <Flex>
              <FlexItem flex={{ default: 'flexNone' }}>
                <span className="child-settings-spacer" />
              </FlexItem>
              <FlexItem flex={{ default: 'flex_1' }}>
                {Object.keys(childSettingsDict).map(key => (
                  <AdvancedSetting
                    key={key}
                    setting={key}
                    settingsDict={childSettingsDict}
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
