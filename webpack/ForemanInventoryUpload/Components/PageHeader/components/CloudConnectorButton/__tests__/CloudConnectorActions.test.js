import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { configureCloudConnector } from '../CloudConnectorActions';

const fixtures = {
  'should configureCloudConnector': () => configureCloudConnector(),
};

describe('CloudConnector button actions', () =>
  testActionSnapshotWithFixtures(fixtures));
