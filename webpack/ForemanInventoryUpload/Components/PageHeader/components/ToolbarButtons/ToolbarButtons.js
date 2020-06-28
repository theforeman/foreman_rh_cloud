import React from 'react';
import { Button, Icon } from 'patternfly-react';
import {
  DOCS_BUTTON_TEXT,
  TASKS_HISTORY_BUTTON_TEXT,
} from '../../../../ForemanInventoryConstants';
import {
  getInventoryDocsUrl,
  getTasksHistoryUrl,
} from '../../../../ForemanInventoryHelpers';
import './toolbarButtons.scss';

const ToolbarButtons = () => (
  <div className="inventory_toolbar_buttons">
    <Button
      className="tasks_history_button"
      href={getTasksHistoryUrl()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="history" />
      {TASKS_HISTORY_BUTTON_TEXT}
    </Button>
    <Button
      href={getInventoryDocsUrl()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon type="pf" name="help" />
      {DOCS_BUTTON_TEXT}
    </Button>
  </div>
);

export default ToolbarButtons;
