import { noop } from 'patternfly-react';

export const API_SUCCESS_RESPONSE = {
  Account1: {
    upload_report_status: 'running',
    generate_report_status: 'running',
  },
  Account2: {
    upload_report_status: 'unknown',
    generate_report_status: 'failure',
  },
  Account3: {
    upload_report_status: 'success',
    generate_report_status: 'running',
  },
};

export const statuses = API_SUCCESS_RESPONSE;

export const pollingProcessID = 0;

export const error = 'some-error';

export const accountID = 'user@redhat.com';

export const processStatusName = 'upload_report_status';

export const props = {
  statuses,
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID,
};
