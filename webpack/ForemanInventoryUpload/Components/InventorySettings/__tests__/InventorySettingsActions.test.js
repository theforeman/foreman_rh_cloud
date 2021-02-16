import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { getSettings, setSetting } from '../InventorySettingsActions';

const fixtures = {
  'should getSettings': () => getSettings(),
  'should setSetting hostObfuscation true': () =>
    setSetting({
      setting: 'hostObfuscation',
      value: true,
    }),
};

describe('Inventory settings actions', () =>
  testActionSnapshotWithFixtures(fixtures));
