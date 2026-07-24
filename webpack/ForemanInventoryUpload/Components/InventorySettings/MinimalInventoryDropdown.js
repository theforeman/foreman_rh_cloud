import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';

import { childSettingsDict } from './AdvancedSetting/AdvancedSettingsConstants';
import { setSetting } from './InventorySettingsActions';

import { selectInsightsMinimalDataCollection } from './InventorySettingsSelectors';

const MinimalInventoryDropdown = ({ setChosenValue }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownValues = {
    minimal: {
      title: __('Minimal data collection'),
      description: __(
        'Only send the minimum required data to Red Hat cloud, obfuscation settings are disabled'
      ),
    },
    optional: {
      title: __('Analytics data collection'),
      description: __(
        'Send additional data to enhance Insights services, as per the settings'
      ),
    },
  };
  const valueToBoolean = {
    minimal: true,
    optional: false,
  };
  const currentSettingBoolean = useSelector(
    selectInsightsMinimalDataCollection
  );
  const currentDropdownValue = currentSettingBoolean ? 'minimal' : 'optional';
  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };
  const onSelect = (_event, value) => {
    setIsOpen(false);
    setChosenValue(value);

    dispatch(
      setSetting({
        setting: 'insights_minimal_data_collection',
        value: valueToBoolean[value],
      })
    );

    if (value === 'minimal') {
      // If user wants to move to minimal data collection, turn on all related settings.
      // These will be overridden by insights_minimal_data_collection anyway, but this takes care of the visuals.
      Object.values(childSettingsDict).forEach(setting => {
        dispatch(
          setSetting({
            setting: setting.name,
            value: true,
          })
        );
      });
    }
  };
  return (
    <Dropdown
      ouiaId="inventory-dropdown"
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={val => setIsOpen(val)}
      popperProps={{ width: '350px' }}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          isFullWidth
          onClick={onToggleClick}
          isExpanded={isOpen}
          ouiaId="inventory-dropdown-toggle"
        >
          {dropdownValues[currentDropdownValue].title}
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        {Object.entries(dropdownValues).map(([value, item]) => (
          <DropdownItem
            value={value}
            key={value}
            description={item.description}
            ouiaId={`inventory-dropdownItem-${value}`}
          >
            {item.title}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

MinimalInventoryDropdown.propTypes = {
  setChosenValue: PropTypes.func.isRequired,
};

export default MinimalInventoryDropdown;
