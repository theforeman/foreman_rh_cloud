import { noop } from 'patternfly-react';

export const files = ['some-file'];
export const exitCode = 'exit 0';
export const logs = ['No running process'];
export const completed = 0;
export const restartProcess = noop;
export const downloadReports = noop;
export const error = null;
export const props = {
  files,
  exitCode,
  logs,
  completed,
  restartProcess,
  downloadReports,
  error,
};
