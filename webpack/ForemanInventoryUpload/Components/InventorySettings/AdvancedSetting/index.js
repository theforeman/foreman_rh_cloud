import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectSettings } from '../InventorySettingsSelectors';
import { handleToggle } from './AdvancedSettingActions';
import SwitcherPF4 from '../../../../common/Switcher/SwitcherPF4';

const AdvancedSetting = ({ setting, settingsDict, isLocked, lockedValue }) => {
  const settingValue = useSelector(store => selectSettings(store)[setting]);
  const dispatch = useDispatch();
  const onToggle = () =>
    dispatch(handleToggle(settingsDict[setting].name, settingValue));
  return (
    <SwitcherPF4
      id={settingsDict[setting].name}
      label={settingsDict[setting].label}
      tooltip={settingsDict[setting].tooltip}
      isChecked={isLocked ? lockedValue : settingValue}
      isDisabled={isLocked}
      onChange={onToggle}
    />
  );
};

AdvancedSetting.propTypes = {
  setting: PropTypes.string.isRequired,
  settingsDict: PropTypes.shape({}).isRequired,
  isLocked: PropTypes.bool,
  lockedValue: PropTypes.bool,
};

AdvancedSetting.defaultProps = {
  isLocked: false,
  lockedValue: true,
};

export default AdvancedSetting;
