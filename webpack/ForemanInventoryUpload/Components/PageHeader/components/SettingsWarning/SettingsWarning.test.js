import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { SettingsWarning } from './SettingsWarning';

const fixtures = {
  'with 2 alerts': {
    autoUpload: false,
    hostObfuscation: true,
    isCloudConnector: true,
  },
  'with isCloudConnector false': {
    autoUpload: true,
    hostObfuscation: true,
    isCloudConnector: false,
  },
};

describe('SettingsWarning', () =>
  testComponentSnapshotsWithFixtures(SettingsWarning, fixtures));
