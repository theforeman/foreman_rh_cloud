import React from 'react';
import DocsButton from '../DocsButton';
import HistoryButton from '../HistoryButton';
import './toolbarButtons.scss';

const ToolbarButtons = () => (
  <div className="inventory_toolbar_buttons">
    <HistoryButton />
    <DocsButton />
  </div>
);

export default ToolbarButtons;
