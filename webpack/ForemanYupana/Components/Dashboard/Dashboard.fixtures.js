import { seperator } from './DashboardHelper';

export const pollingProcessID = 1;

export const logs = ['some-logs...'];

export const completed = 25;

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

export const files = ['some-file'];

export const activeTab = 'uploading';

const initialLog = ['No running process', seperator];

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
