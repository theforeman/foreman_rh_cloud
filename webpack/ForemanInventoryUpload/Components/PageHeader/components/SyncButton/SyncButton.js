import React from 'react';
import { Button, Icon } from 'patternfly-react';
import API from 'foremanReact/API';
import { inventorySyncUrl } from './SyncButtonHelpers';
import { SYNC_BUTTON_TEXT } from '../../../../ForemanInventoryConstants';

const SyncButton = () => (
  <Button
    className="sync_button"
    onClick={() => API.post(inventorySyncUrl('tasks'))}
    bsSize="lg"
  >
    <Icon name="refresh" />
    {SYNC_BUTTON_TEXT}
  </Button>
);

export default SyncButton;
