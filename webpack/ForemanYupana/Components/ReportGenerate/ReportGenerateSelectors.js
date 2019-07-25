import { selectForemanYupana } from '../../ForemanYupanaSelectors';
import { selectGenerating } from '../Dashboard/DashboardSelectors';

export const selectReportGenerate = state =>
  selectForemanYupana(state).generating;
export const selectProcessID = state => selectReportGenerate(state).processID;
export const selectLogs = state => selectGenerating(state).logs;
export const selectCompleted = state => selectGenerating(state).completed;
export const selectError = state => selectGenerating(state).error;
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
