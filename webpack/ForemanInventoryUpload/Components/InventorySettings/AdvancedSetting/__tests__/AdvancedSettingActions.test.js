import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { handleToggle } from '../AdvancedSettingActions';

const fixtures = {
  'should handleToggle': () => handleToggle('autoUploadEnabled', false),
};

describe('AdvancedSetting actions', () =>
  testActionSnapshotWithFixtures(fixtures));
