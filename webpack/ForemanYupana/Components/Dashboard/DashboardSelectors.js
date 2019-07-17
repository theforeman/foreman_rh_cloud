import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectDashboard = state => selectForemanYupana(state).dashboard;
export const selectCompleted = state => selectDashboard(state).completed;
export const selectLogs = state => selectDashboard(state).logs;
export const selectPollingProcessID = state =>
  selectDashboard(state).pollingProcessID;
