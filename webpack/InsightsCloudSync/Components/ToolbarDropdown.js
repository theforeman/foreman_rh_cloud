import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { redHatAdvisorSystems } from '../InsightsCloudSyncHelpers';

const ToolbarDropdown = ({ onRecommendationSync }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownItems = [
    <DropdownItem
      key="recommendation-manual-sync"
      onClick={onRecommendationSync}
    >
      {__('Sync recommendations')}
    </DropdownItem>,
    <DropdownItem key="cloud-advisor-systems-link">
      <a
        href={redHatAdvisorSystems()}
        target="_blank"
        rel="noopener noreferrer"
      >
        {__('View in Red Hat Insights')}
        {'  '}
        <ExternalLinkAltIcon />
      </a>
    </DropdownItem>,
  ];
  return (
    <Dropdown
      className="title-dropdown"
      onSelect={() => setIsDropdownOpen(false)}
      toggle={<KebabToggle onToggle={isOpen => setIsDropdownOpen(isOpen)} />}
      isOpen={isDropdownOpen}
      isPlain
      dropdownItems={dropdownItems}
    />
  );
};

ToolbarDropdown.propTypes = {
  onRecommendationSync: PropTypes.func.isRequired,
};

export default ToolbarDropdown;
