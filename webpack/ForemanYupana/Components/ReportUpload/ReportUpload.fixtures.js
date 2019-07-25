import { noop } from 'patternfly-react';

export const files = ['some-file'];
export const exitCode = 0;
export const loading = false;
export const logs = ['No running process'];
export const completed = 0;
export const restartProcess = noop;
export const downloadReports = noop;
export const error = null;
export const props = {
  files,
  exitCode,
  loading,
  logs,
  completed,
  restartProcess,
  downloadReports,
  error,
};
