import React, { useState } from 'react';
import {
  Grid,
  GridItem,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import Head from 'foremanReact/components/Head';
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
import { useIopConfig } from '../../../common/Hooks/ConfigHooks';

const PageTitle = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isIop = useIopConfig();
  const [showPingModal, setPingModal] = useState(false);
  const togglePingModal = () => setPingModal(v => !v);

  return (
    <Grid className="inventory-upload-header-title">
      <GridItem span={6}>
        <Head>
          <title>{INVENTORY_PAGE_TITLE}</title>
        </Head>
        <h1>{INVENTORY_PAGE_TITLE}</h1>
      </GridItem>
      <GridItem
        span={6}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginRight: '-16px',
        }}
      >
        <Dropdown
          className="title-dropdown"
          ouiaId="title-dropdown"
          isOpen={isDropdownOpen}
          onSelect={() => setIsDropdownOpen(false)}
          onOpenChange={val => setIsDropdownOpen(val)}
          popperProps={{ position: 'end' }}
          toggle={toggleRef => (
            <MenuToggle
              ref={toggleRef}
              aria-label={__('Actions')}
              variant="plain"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              isExpanded={isDropdownOpen}
            >
              <EllipsisVIcon />
            </MenuToggle>
          )}
        >
          <DropdownList>
            <DropdownItem
              key="tasks-history-button"
              ouiaId="tasks-history-button"
              to={getActionsHistoryUrl()}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ACTIONS_HISTORY_BUTTON_TEXT}
            </DropdownItem>
            <DropdownItem
              key="inventory-documentation-button"
              ouiaId="inventory-documentation-button"
              to={getInventoryDocsUrl()}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
            >
              {DOCS_BUTTON_TEXT}
            </DropdownItem>
            {!isIop && (
              <DropdownItem
                key="cloud-ping"
                ouiaId="dropdownItem-cloud-ping"
                onClick={togglePingModal}
              >
                {CLOUD_PING_TITLE}
              </DropdownItem>
            )}
          </DropdownList>
        </Dropdown>
        <CloudPingModal
          isOpen={showPingModal}
          toggle={togglePingModal}
          title={CLOUD_PING_TITLE}
        />
      </GridItem>
    </Grid>
  );
};
export default PageTitle;
