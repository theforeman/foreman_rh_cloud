import React from 'react';
import SyncButton from '../SyncButton';
import CloudConnectorButton from '../CloudConnectorButton';
import './toolbarButtons.scss';

const ToolbarButtons = () => (
  <div className="inventory_toolbar_buttons">
    <CloudConnectorButton />
    <SyncButton />
  </div>
);

export default ToolbarButtons;
