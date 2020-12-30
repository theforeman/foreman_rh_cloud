import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import SwitcherPF4 from '../../../common/Switcher/SwitcherPF4';

const ExcludePackagesSwitcher = ({ excludePackages, handleToggle }) => (
  <div className="exclude_packages_switcher">
    <SwitcherPF4
      id="exclude-packages-setting-switcher"
      label={__('Exclude Packages')}
      tooltip={__('Exclude packages from being uploaded to the Red Hat cloud')}
      isChecked={excludePackages}
      onChange={() => handleToggle(excludePackages)}
    />
  </div>
);

ExcludePackagesSwitcher.propTypes = {
  excludePackages: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
};

ExcludePackagesSwitcher.defaultProps = {
  excludePackages: false,
};

export default ExcludePackagesSwitcher;
