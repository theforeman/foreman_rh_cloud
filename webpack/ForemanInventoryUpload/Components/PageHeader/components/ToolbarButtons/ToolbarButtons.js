import React from 'react';
import { useSelector } from 'react-redux';
import SyncButton from '../SyncButton';
import './toolbarButtons.scss';
import { selectSubscriptionConnectionEnabled } from '../../../InventorySettings/InventorySettingsSelectors';

const ToolbarButtons = () => {
  const subscriptionConnectionEnabled = useSelector(
    selectSubscriptionConnectionEnabled
  );

  if (!subscriptionConnectionEnabled) {
    return null;
  }

  return (
    <div className="inventory_toolbar_buttons">
      <SyncButton />
    </div>
  );
};

export default ToolbarButtons;
