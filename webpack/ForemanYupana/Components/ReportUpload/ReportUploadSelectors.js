import { selectForemanYupana } from '../../ForemanYupanaSelectors';
import {
  selectLogs as selectDashboardLogs,
  selectCompleted as selectDashboardCompleted,
} from '../Dashboard/DashboardSelectors';

export const selectReportUpload = state => selectForemanYupana(state).uploading;
export const selectProcessID = state => selectReportUpload(state).processID;
export const selectPollingProcessID = state =>
  selectReportUpload(state).pollingProcessID;
export const selectLogs = state => selectDashboardLogs(state).uploading;
export const selectCompleted = state =>
  selectDashboardCompleted(state).uploading;
export const selectLoading = state =>
  selectReportUpload(state).status === 'running';
export const selectExitCode = state => {
  const { status } = selectReportUpload(state);
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
