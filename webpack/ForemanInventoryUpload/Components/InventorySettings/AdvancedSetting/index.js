import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectSettings } from '../InventorySettingsSelectors';
import { handleToggle } from './AdvancedSettingActions';
import SwitcherPF4 from '../../../../common/Switcher/SwitcherPF4';
import { settingsDict } from './AdvancedSettingsConstants';

const AdvancedSetting = ({ setting }) => {
  const settingValue = useSelector(store => selectSettings(store)[setting]);
  const dispatch = useDispatch();
  const onToggle = () =>
    dispatch(handleToggle(settingsDict[setting].name, settingValue));
  return (
    <SwitcherPF4
      id={settingsDict[setting].id}
      label={settingsDict[setting].label}
      tooltip={settingsDict[setting].tooltip}
      isChecked={settingValue}
      onChange={onToggle}
    />
  );
};

AdvancedSetting.propTypes = {
  setting: PropTypes.string.isRequired,
};

export default AdvancedSetting;
