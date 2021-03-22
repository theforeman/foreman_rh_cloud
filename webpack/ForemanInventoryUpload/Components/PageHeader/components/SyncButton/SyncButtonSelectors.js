import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { INVENTORY_SYNC_TASK_UPDATE } from './SyncButtonConstants';

export const selectTaskStatus = state => {
  const { result } = selectAPIResponse(state, INVENTORY_SYNC_TASK_UPDATE);
  return typeof result === 'string' ? result.toUpperCase() : null;
};
