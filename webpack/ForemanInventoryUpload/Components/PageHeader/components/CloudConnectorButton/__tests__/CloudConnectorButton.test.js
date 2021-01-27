import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { CloudConnectorButton } from '../CloudConnectorButton';
import { CONNECTOR_STATUS } from '../CloudConnectorConstants';

const fixtures = {
  'render no cloud connector': {
    status: CONNECTOR_STATUS.NOT_RESOLVED,
    onClick: jest.fn(),
  },
  'render resolved cloud connector': {
    status: CONNECTOR_STATUS.RESOLVED,
    onClick: jest.fn(),
  },
  'render pending connector': {
    jobLink: '/job-link',
    status: CONNECTOR_STATUS.PENDING,
    onClick: jest.fn(),
  },
};

describe('CloudConnectorButton', () =>
  testComponentSnapshotsWithFixtures(CloudConnectorButton, fixtures));
