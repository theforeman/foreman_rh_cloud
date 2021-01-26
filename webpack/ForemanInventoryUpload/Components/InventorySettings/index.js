import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InventorySettings from './InventorySettings';
import {
  selectRHInventoryEnabled,
  selectCloudConnectorEnabled,
} from './InventorySettingsSelectors';
import {
  handleToggleRHInventory,
  handleToggleCloudConnector,
} from './InventorySettingsActions';

const ConnectedInventorySettings = () => {
  const rhInventory = useSelector(store => selectRHInventoryEnabled(store));
  const cloudConnector = useSelector(store =>
    selectCloudConnectorEnabled(store)
  );
  const dispatch = useDispatch();
  return (
    <InventorySettings
      handleToggleRHInventory={() =>
        dispatch(handleToggleRHInventory(rhInventory))
      }
      handleToggleCloudConnector={() =>
        dispatch(handleToggleCloudConnector(cloudConnector))
      }
      rhInventory={rhInventory}
      cloudConnector={cloudConnector}
    />
  );
};

export default ConnectedInventorySettings;
