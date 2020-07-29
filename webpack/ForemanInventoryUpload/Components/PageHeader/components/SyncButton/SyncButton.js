import React from 'react';
import { Button, Icon } from 'patternfly-react';
import { SYNC_BUTTON_TEXT } from '../../../../ForemanInventoryConstants';

const SyncButton = ({ handleSync }) => (
  <Button className="sync_button" onClick={handleSync} bsSize="lg">
    <Icon name="refresh" />
    {SYNC_BUTTON_TEXT}
  </Button>
);

export default SyncButton;
