import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import HistoryButton from '../HistoryButton';

global.URL_PREFIX = '';

const fixtures = {
  'render without Props': {},
};

describe('HistoryButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(HistoryButton, fixtures));
});
