import { selectForemanInventoryUpload } from '../../../ForemanRhCloudSelectors';

export const selectInventoryFilter = state =>
  selectForemanInventoryUpload(state).inventoryFilter;

export const selectFilterTerm = state =>
  selectInventoryFilter(state).filterTerm;
