import { noop } from 'foremanReact/common/helpers';

export const pollingProcessID = 1;

export const logs = ['some-logs...'];

export const completed = 25;

export const error = 'some-error';

export const generating = {
  logs,
  completed,
};

export const uploading = {
  logs,
  completed,
  files,
};

export const inventory = {
  generating,
  uploading,
};

export const accountID = 'some-account-ID';

export const exitCode = 0;

export const files = ['some-file'];

export const activeTab = 'uploads';

export const scheduled = '2019-08-21T16:14:16.520+03:00';

export const serverMock = {
  data: { output: 'some-logs\nsome-logs', status: exitCode, scheduled },
};

export const initialState = {};

export const props = {
  accountID,
  uploading: {},
  generating: {},
  startPolling: noop,
  fetchLogs: noop,
  stopPolling: noop,
  setActiveTab: noop,
  restartProcess: noop,
  downloadReports: noop,
  pollingProcessID: 0,
};
