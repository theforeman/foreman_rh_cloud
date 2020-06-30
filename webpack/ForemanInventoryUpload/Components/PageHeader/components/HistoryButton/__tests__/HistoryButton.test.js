import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import HistoryButton from '../HistoryButton';

const fixtures = {
  'render without Props': {},
};

describe('HistoryButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(HistoryButton, fixtures));
});
