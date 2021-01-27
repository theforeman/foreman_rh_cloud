import { noop } from 'patternfly-react';

export const accounts = {
  Account1: {
    label: 'test_org1',
    upload_report_status: 'running',
    generate_report_status: 'running',
  },
  Account2: {
    label: 'test_org2',
    upload_report_status: 'unknown',
    generate_report_status: 'failure',
  },
  Account3: {
    label: 'test_org3',
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

export const filterTerm = 'some_filter';

export const cloudToken = 'some-cloud-token';

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
  cloudToken,
  CloudConnectorStatus,
};

export const fetchAccountsStatusResponse = {
  data: pollingResponse,
};
