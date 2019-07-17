import { noop } from 'patternfly-react';
import { seperator } from './DashboardHelper';

export const generating = {
  exitCode: 0,

  processScheduledTime: '23:45',
  onRestart: noop,
};

export const uploading = {
  exitCode: 0,
  files: ['213783213', '213213213', '101763276', '12387892712'],
  onRestart: noop,
  onDownload: noop,
};

export const pollingProcessID = 1;

export const logs = {
  generating: ['some-logs...'],
  uploading: ['some-logs...'],
};

export const completed = {
  generating: 50,
  uploading: 25,
};

export const yupana = { logs, completed };

export const initialState = {
  logs: {
    generating: ['No running process', seperator],
    uploading: ['No running process', seperator],
  },
  completed: {
    generating: 0,
    uploading: 0,
  },
  pollingProcessID: 0,
};
