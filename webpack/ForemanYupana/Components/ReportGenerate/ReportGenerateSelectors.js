import { selectForemanYupana } from '../../ForemanYupanaSelectors';
import {
  selectLogs as selectDashboardLogs,
  selectCompleted as selectDashboardCompleted,
} from '../Dashboard/DashboardSelectors';

export const selectReportGenerate = state =>
  selectForemanYupana(state).generating;
export const selectProcessID = state => selectReportGenerate(state).processID;
export const selectPollingProcessID = state =>
  selectReportGenerate(state).pollingProcessID;
export const selectLogs = state => selectDashboardLogs(state).generating;
export const selectCompleted = state =>
  selectDashboardCompleted(state).generating;

export const selectLoading = state =>
  selectReportGenerate(state).status === 'running';

export const selectExitCode = state => {
  const { status } = selectReportGenerate(state);
  let exitCode;
  switch (status) {
    case 'success':
      exitCode = '0';
      break;
    case 'failure':
      exitCode = '1';
      break;
    default:
      exitCode = '--';
  }
  return exitCode;
};
