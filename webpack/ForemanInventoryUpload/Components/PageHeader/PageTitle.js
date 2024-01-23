import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  KebabToggle,
  DropdownPosition,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import Head from 'foremanReact/components/Head';
import {
  INVENTORY_PAGE_TITLE,
  ACTIONS_HISTORY_BUTTON_TEXT,
  DOCS_BUTTON_TEXT,
  CLOUD_PING_TITLE,
  ABOUT_TITLE,
  SETTINGS_TITLE,
} from '../../ForemanInventoryConstants';
import {
  getActionsHistoryUrl,
  getInventoryDocsUrl,
} from '../../ForemanInventoryHelpers';
import CloudPingModal from './components/CloudPingModal';
import AboutModal from './components/AboutModal';
import SettingsModal from './components/SettingsModal';

const PageTitle = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPingModal, setPingModal] = useState(false);
  const [showAboutModal, setAboutModal] = useState(false);
  const [showSettingsModal, setSettingsModal] = useState(false);

  const togglePingModal = () => setPingModal(v => !v);
  const toggleAboutModal = () => setAboutModal(v => !v);
  const toggleSettingsModal = () => setSettingsModal(v => !v);

  const dropdownItems = [
    <DropdownItem key="settings" onClick={toggleSettingsModal}>
      {SETTINGS_TITLE}
    </DropdownItem>,
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
    <DropdownItem key="about" onClick={toggleAboutModal}>
      {ABOUT_TITLE}
    </DropdownItem>,
  ];
  return (
    <Grid className="inventory-upload-header-title">
      <GridItem span={6}>
        <Head>
          <title>{INVENTORY_PAGE_TITLE}</title>
        </Head>
        <h1>{INVENTORY_PAGE_TITLE}</h1>
      </GridItem>
      <GridItem span={6}>
        <Dropdown
          className="title-dropdown"
          onSelect={() => setIsDropdownOpen(false)}
          toggle={
            <KebabToggle onToggle={isOpen => setIsDropdownOpen(isOpen)} />
          }
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
        <AboutModal
          isOpen={showAboutModal}
          toggle={toggleAboutModal}
          title={ABOUT_TITLE}
        />
        <SettingsModal
          isOpen={showSettingsModal}
          toggle={toggleSettingsModal}
          title={SETTINGS_TITLE}
        />
      </GridItem>
    </Grid>
  );
};
export default PageTitle;
