import { foremanUrl } from '../../../../../ForemanRhCloudHelpers';
import { selectAccountsList } from '../../../AccountList/AccountListSelectors';
import { CONNECTOR_STATUS } from './CloudConnectorConstants';

export const SelectCloudConnectorStatus = state =>
  selectAccountsList(state).CloudConnectorStatus || {};

export const selectStatus = state => {
  const { task } = SelectCloudConnectorStatus(state);
  if (!task) return CONNECTOR_STATUS.NOT_RESOLVED;
  if (task.result === 'pending') return CONNECTOR_STATUS.PENDING;
  if (task.result === 'success') return CONNECTOR_STATUS.RESOLVED;
  return CONNECTOR_STATUS.NOT_RESOLVED;
};

export const selectJobLink = state => {
  const { id } = SelectCloudConnectorStatus(state);
  return id ? foremanUrl(`/job_invocations/${id}`) : '';
};
