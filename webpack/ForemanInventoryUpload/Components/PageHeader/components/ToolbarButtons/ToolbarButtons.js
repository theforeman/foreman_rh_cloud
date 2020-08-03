import React from 'react';
import DocsButton from '../DocsButton';
import HistoryButton from '../HistoryButton';
import SyncButton from '../SyncButton';
import './toolbarButtons.scss';

const ToolbarButtons = () => (
  <div className="inventory_toolbar_buttons">
    <SyncButton />
    <HistoryButton />
    <DocsButton />
  </div>
);

export default ToolbarButtons;
