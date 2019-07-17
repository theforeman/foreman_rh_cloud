import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectReportGenerate = state =>
  selectForemanYupana(state).generating;
export const selectProcessID = state => selectReportGenerate(state).processID;
export const selectPollingProcessID = state =>
  selectReportGenerate(state).pollingProcessID;
export const selectLogs = state => selectReportGenerate(state).logs;
export const selectCompleted = state => selectReportGenerate(state).completed;

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
