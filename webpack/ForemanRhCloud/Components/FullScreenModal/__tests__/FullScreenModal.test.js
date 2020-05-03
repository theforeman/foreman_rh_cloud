import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import FullScreenModal from '../FullScreenModal';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('FullScreenModal', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(FullScreenModal, fixtures));
});
