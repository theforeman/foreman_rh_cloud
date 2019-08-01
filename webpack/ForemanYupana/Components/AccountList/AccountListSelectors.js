import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectAccountsList = state =>
  selectForemanYupana(state).accountsList;
export const selectStatuses = state => selectAccountsList(state).statuses;
export const selectPollingProcessID = state =>
  selectAccountsList(state).pollingProcessID;
