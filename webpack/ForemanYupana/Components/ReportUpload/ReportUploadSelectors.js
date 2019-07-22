import { selectForemanYupana } from '../../ForemanYupanaSelectors';
import { selectUploading } from '../Dashboard/DashboardSelectors';

export const selectReportUpload = state => selectForemanYupana(state).uploading;
export const selectProcessID = state => selectReportUpload(state).processID;
export const selectLogs = state => selectUploading(state).logs;
export const selectCompleted = state => selectUploading(state).completed;
export const selectLoading = state =>
  selectReportUpload(state).status === 'running';
export const selectFiles = state => selectUploading(state).files;
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
