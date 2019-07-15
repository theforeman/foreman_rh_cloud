import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectReportGenerate = state =>
  selectForemanYupana(state).reportGenerate;
export const selectProcessID = state => selectReportGenerate(state).processID;
export const selectLogs = state => selectReportGenerate(state).logs;
export const selectCompleted = state => selectReportGenerate(state).completed;
export const selectLoading = state =>
  selectReportGenerate(state).status === 'running';
