import { seperator } from './DashboardHelper';

export const pollingProcessID = 1;

export const logs = ['some-logs...'];

export const completed = 25;

export const error = 'some-error';

export const yupana = {
  generating: {
    logs,
    completed,
  },
  uploading: {
    logs,
    completed,
    files,
  },
};

export const exitCode = 0;

export const files = { queue: ['some-file'], error: null };

export const activeTab = 'uploads';

const initialLog = ['No running process', seperator];

export const serverMock = { data: { output: logs, status: exitCode } };

export const initialState = {
  generating: {
    logs: initialLog,
    completed,
  },
  uploading: {
    logs: initialLog,
    completed,
    files,
  },
  pollingProcessID: 0,
  activeTab,
};
