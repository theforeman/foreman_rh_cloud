import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  KebabToggle,
  DropdownPosition,
} from '@patternfly/react-core';
import {
  INVENTORY_PAGE_TITLE,
  ACTIONS_HISTORY_BUTTON_TEXT,
  DOCS_BUTTON_TEXT,
  CLOUD_PING_TITLE,
} from '../../ForemanInventoryConstants';
import {
  getActionsHistoryUrl,
  getInventoryDocsUrl,
} from '../../ForemanInventoryHelpers';
import CloudPingModal from './components/CloudPingModal';

const PageTitle = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPingModal, setPingModal] = useState(false);
  const togglePingModal = () => setPingModal(v => !v);
  const dropdownItems = [
    <DropdownItem
      key="tasks-history-button"
      href={getActionsHistoryUrl()}
      target="_blank"
      rel="noopener noreferrer"
    >
      {ACTIONS_HISTORY_BUTTON_TEXT}
    </DropdownItem>,
    <DropdownItem
      key="inventory-documentation-button"
      href={getInventoryDocsUrl()}
      target="_blank"
      rel="noopener noreferrer"
    >
      {DOCS_BUTTON_TEXT}
    </DropdownItem>,
    <DropdownItem key="cloud-ping" onClick={togglePingModal}>
      {CLOUD_PING_TITLE}
    </DropdownItem>,
  ];
  return (
    <div className="row form-group inventory-upload-header-title">
      <h1 className="col-md-8">{INVENTORY_PAGE_TITLE}</h1>
      <Dropdown
        className="title-dropdown"
        onSelect={() => setIsDropdownOpen(false)}
        toggle={<KebabToggle onToggle={isOpen => setIsDropdownOpen(isOpen)} />}
        isOpen={isDropdownOpen}
        isPlain
        dropdownItems={dropdownItems}
        position={DropdownPosition.right}
      />
      <CloudPingModal
        isOpen={showPingModal}
        toggle={togglePingModal}
        title={CLOUD_PING_TITLE}
      />
    </div>
  );
};
export default PageTitle;
