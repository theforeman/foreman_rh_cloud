import { noop } from 'patternfly-react';

export const accounts = {
  Account1: {
    id: 1,
    upload_report_status: 'running',
    generate_report_status: 'running',
  },
  Account2: {
    id: 2,
    upload_report_status: 'unknown',
    generate_report_status: 'failure',
  },
  Account3: {
    id: 3,
    upload_report_status: 'success',
    generate_report_status: 'running',
  },
};

export const accountIDs = Object.keys(accounts);

export const API_SUCCESS_RESPONSE = accounts;

export const pollingProcessID = 0;

export const error = 'some-error';

export const accountID = 'user@redhat.com';

export const processStatusName = 'upload_report_status';

export const autoUploadEnabled = true;

export const hostObfuscationEnabled = true;

export const ipsObfuscationEnabled = true;

export const filterTerm = 'some_filter';

export const cloudToken = true;

export const excludePackages = false;

export const CloudConnectorStatus = {
  id: 7,
  task: { id: 11 },
};

export const props = {
  accounts,
  fetchAccountsStatus: noop,
  startAccountStatusPolling: noop,
  stopAccountStatusPolling: noop,
  pollingProcessID,
};

export const pollingResponse = {
  accounts,
  autoUploadEnabled,
  hostObfuscationEnabled,
  ipsObfuscationEnabled,
  cloudToken,
  excludePackages,
  CloudConnectorStatus,
};

export const fetchAccountsStatusResponse = {
  data: pollingResponse,
};
