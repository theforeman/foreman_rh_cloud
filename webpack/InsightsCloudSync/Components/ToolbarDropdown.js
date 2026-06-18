import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';
import { EllipsisVIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { redHatAdvisorSystems } from '../InsightsCloudSyncHelpers';
import { useIopConfig } from '../../common/Hooks/ConfigHooks';

const ToolbarDropdown = ({ onRecommendationSync }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isIop = useIopConfig();
  if (isIop) {
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
      onOpenChange={setIsDropdownOpen}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          variant="plain"
          aria-label={__('Recommendations actions')}
          isExpanded={isDropdownOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      isOpen={isDropdownOpen}
      shouldFocusToggleOnSelect
      popperProps={{ position: 'right' }}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};

ToolbarDropdown.propTypes = {
  onRecommendationSync: PropTypes.func.isRequired,
};

export default ToolbarDropdown;
