import { seperator } from './DashboardHelper';

export const pollingProcessID = 1;

export const logs = {
  generating: ['some-logs...'],
  uploading: ['some-logs...'],
};

export const completed = {
  generating: 50,
  uploading: 25,
};

export const yupana = { logs, completed, files };

export const files = ['some-file'];

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
