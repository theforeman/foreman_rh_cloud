import { noop } from 'patternfly-react';

export const API_SUCCESS_RESPONSE = {
  Account1: { uploading: 'running', generating: 'running' },
  Account2: { uploading: 'unknown', generating: 'failure' },
  Account3: { uploading: 'success', generating: 'running' },
};

export const statuses = API_SUCCESS_RESPONSE;

export const pollingProcessID = 0;

export const error = 'some-error';

export const props = {
  statuses,
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID,
};
