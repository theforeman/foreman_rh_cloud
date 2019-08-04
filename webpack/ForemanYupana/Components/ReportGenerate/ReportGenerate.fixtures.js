import { noop } from 'patternfly-react';

export const exitCode = 'exit 0';
export const logs = ['No running process'];
export const completed = 0;
export const restartProcess = noop;
export const error = null;
export const processScheduledTime = 'some-time';
export const props = {
  exitCode,
  logs,
  completed,
  restartProcess,
  error,
};
