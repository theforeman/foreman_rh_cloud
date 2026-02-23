import React from 'react';
import { useSelector } from 'react-redux';
import SyncButton from '../SyncButton';
import CloudConnectorButton from '../CloudConnectorButton';
import './toolbarButtons.scss';
import { selectSubscriptionConnectionEnabled } from '../../../InventorySettings/InventorySettingsSelectors';
import { useIopConfig } from '../../../../../common/Hooks/ConfigHooks';

const ToolbarButtons = () => {
  const subscriptionConnectionEnabled = useSelector(
    selectSubscriptionConnectionEnabled
  );
  const isIop = useIopConfig();

  if (!subscriptionConnectionEnabled) {
    return null;
  }

  return (
    <div className="inventory_toolbar_buttons">
      {!isIop && <CloudConnectorButton />}
      <SyncButton />
    </div>
  );
};

export default ToolbarButtons;
