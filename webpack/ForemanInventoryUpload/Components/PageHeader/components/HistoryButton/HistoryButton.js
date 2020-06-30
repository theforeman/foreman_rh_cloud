import React from 'react';
import { Button, Icon } from 'patternfly-react';
import { ACTIONS_HISTORY_BUTTON_TEXT } from '../../../../ForemanInventoryConstants';
import { getActionsHistoryUrl } from '../../../../ForemanInventoryHelpers';

const HistoryButton = () => (
  <Button
    className="tasks_history_button"
    href={getActionsHistoryUrl()}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon name="history" />
    {ACTIONS_HISTORY_BUTTON_TEXT}
  </Button>
);

export default HistoryButton;
