import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectReportUpload = state => selectForemanYupana(state).uploading;
export const selectProcessID = state => selectReportUpload(state).processID;
export const selectPollingProcessID = state =>
  selectReportUpload(state).pollingProcessID;
export const selectLogs = state => selectReportUpload(state).logs;
export const selectCompleted = state => selectReportUpload(state).completed;

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
