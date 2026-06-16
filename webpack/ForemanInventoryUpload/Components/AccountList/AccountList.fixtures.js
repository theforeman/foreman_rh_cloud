import { noop } from 'foremanReact/common/helpers';

export const accounts = {
  Account1: {
    id: 1,
    uploaded_status: 'running',
    generated_status: 'running',
  },
  Account2: {
    id: 2,
    uploaded_status: 'unknown',
    generated_status: 'failure',
  },
  Account3: {
    id: 3,
    uploaded_status: 'success',
    generated_status: 'running',
  },
};

export const accountIDs = Object.keys(accounts);

export const API_SUCCESS_RESPONSE = accounts;

export const pollingProcessID = 0;

export const error = 'some-error';

export const accountID = 'user@redhat.com';

export const processStatusName = 'upload_report_status';

export const filterTerm = 'some_filter';

export const props = {
  accounts,
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID,
};

export const pollingResponse = {
  accounts,
};

export const fetchAccountsStatusResponse = {
  data: pollingResponse,
};
