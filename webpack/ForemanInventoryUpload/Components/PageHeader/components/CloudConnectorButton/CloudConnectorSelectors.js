import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { foremanUrl } from '../../../../../ForemanRhCloudHelpers';

import {
  CONFIGURE_CLOUD_CONNECTOR,
  CONNECTOR_STATUS,
} from './CloudConnectorConstants';

export const selectStatus = state => {
  const { task } = selectAPIResponse(state, CONFIGURE_CLOUD_CONNECTOR);
  if (!task) return CONNECTOR_STATUS.NOT_RESOLVED;
  if (task.result === 'running' || task.result === 'pending')
    return CONNECTOR_STATUS.PENDING;
  if (task.result === 'success') return CONNECTOR_STATUS.RESOLVED;
  return CONNECTOR_STATUS.NOT_RESOLVED;
};

export const selectJobLink = state => {
  const { id } = selectAPIResponse(state, CONFIGURE_CLOUD_CONNECTOR);
  return id ? foremanUrl(`/job_invocations/${id}`) : '';
};
