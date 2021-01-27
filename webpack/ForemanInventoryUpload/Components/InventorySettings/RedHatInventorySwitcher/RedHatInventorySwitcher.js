import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import ShortSwitcherPF4 from '../../../../common/Switcher/ShortSwitcherPF4';

const RedHatInventorySwitcher = ({ isEnabled, handleToggle }) => (
  <ShortSwitcherPF4
    id="rh-inventory-settings-switcher"
    label={__('Red Hat Inventory')}
    isChecked={isEnabled}
    onChange={handleToggle}
  />
);

RedHatInventorySwitcher.propTypes = {
  isEnabled: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
};

RedHatInventorySwitcher.defaultProps = {
  isEnabled: false,
};
export default RedHatInventorySwitcher;
