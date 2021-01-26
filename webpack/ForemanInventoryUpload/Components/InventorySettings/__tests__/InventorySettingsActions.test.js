import { testActionSnapshotWithFixtures } from '@theforeman/test';
import {
  handleToggleRHInventory,
  handleToggleCloudConnector,
} from '../InventorySettingsActions';

const fixtures = {
  'should handleToggleRHInventory true': () => handleToggleRHInventory(true),
  'should handleToggleCloudConnector false': () =>
    handleToggleCloudConnector(false),
};

describe('Inventory settings actions', () =>
  testActionSnapshotWithFixtures(fixtures));
