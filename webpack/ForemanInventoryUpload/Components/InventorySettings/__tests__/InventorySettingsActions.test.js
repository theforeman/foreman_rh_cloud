import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { handleToggleRHInventory } from '../InventorySettingsActions';

const fixtures = {
  'should handleToggleRHInventory true': () => handleToggleRHInventory(true),
};

describe('Inventory settings actions', () =>
  testActionSnapshotWithFixtures(fixtures));
