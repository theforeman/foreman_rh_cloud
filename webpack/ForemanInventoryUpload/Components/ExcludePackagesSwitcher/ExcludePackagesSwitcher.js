import React from 'react';
import PropTypes from 'prop-types';
import { Switch, FieldLevelHelp } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import './excludePackagesSwitcher.scss';

const ExcludePackagesSwitcher = ({ excludePackages, handleToggle }) => (
  <div className="exclude_packages_switcher">
    <span>Exclude Packages</span>
    <FieldLevelHelp
      content={__('Exclude packages from being uploaded to the Red Hat cloud')}
    />
    <Switch
      size="mini"
      value={excludePackages}
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
