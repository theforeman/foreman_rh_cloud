import {
  RH_INVENTORY_TOGGLE,
  CLOUD_CONNECTOR_TOGGLE,
} from './InventorySettingsConstants';

export const handleToggleRHInventory = current => ({
  type: RH_INVENTORY_TOGGLE,
  payload: {
    rhInventory: !current,
  },
});

export const handleToggleCloudConnector = current => ({
  type: CLOUD_CONNECTOR_TOGGLE,
  payload: {
    cloudConnector: !current,
  },
});
