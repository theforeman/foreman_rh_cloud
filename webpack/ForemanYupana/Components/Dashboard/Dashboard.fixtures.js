import { noop } from 'patternfly-react';

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

export const accountID = 'some-account-ID';

export const exitCode = 0;

export const files = ['some-file'];

export const activeTab = 'uploads';

export const serverMock = { data: { output: logs, status: exitCode } };

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
