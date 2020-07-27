import { foremanUrl } from '../../../../../ForemanRhCloudHelpers';

export const inventorySyncUrl = path => foremanUrl(`/inventory_sync/${path}`);
