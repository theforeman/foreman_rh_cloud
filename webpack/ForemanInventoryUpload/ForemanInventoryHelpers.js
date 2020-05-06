import { INVENTORY_BASE_URL } from './ForemanInventoryConstants';

export const inventoryUrl = path => `${INVENTORY_BASE_URL}${path}`;

export const inventoryStateWrapper = innerState => ({
  ForemanRhCloud: {
    inventoryUpload: { ...innerState },
  },
});
