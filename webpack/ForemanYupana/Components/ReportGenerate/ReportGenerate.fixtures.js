import { noop } from 'patternfly-react';

export const exitCode = 0;
export const loading = false;
export const logs = ['No running process'];
export const completed = 0;
export const restartProcess = noop;
export const error = null;
export const processScheduledTime = 'some-time';
export const props = {
  exitCode,
  loading,
  logs,
  completed,
  restartProcess,
  error,
};
