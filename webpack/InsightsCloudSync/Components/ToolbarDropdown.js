import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core/deprecated';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { redHatAdvisorSystems } from '../InsightsCloudSyncHelpers';
import { useAdvisorEngineConfig } from '../../common/Hooks/ConfigHooks';

const ToolbarDropdown = ({ onRecommendationSync }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLocalAdvisorEngine = useAdvisorEngineConfig();
  if (isLocalAdvisorEngine) {
    return null;
  }
  const dropdownItems = [
    <DropdownItem
      key="recommendation-manual-sync"
      ouiaId="recommendation-manual-sync"
      onClick={onRecommendationSync}
    >
      {__('Sync recommendations')}
    </DropdownItem>,
    <DropdownItem
      key="cloud-advisor-systems-link"
      ouiaId="cloud-advisor-systems-link"
    >
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
      ouiaId="title-dropdown"
      onSelect={() => setIsDropdownOpen(false)}
      toggle={
        <KebabToggle onToggle={(_event, isOpen) => setIsDropdownOpen(isOpen)} />
      }
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
