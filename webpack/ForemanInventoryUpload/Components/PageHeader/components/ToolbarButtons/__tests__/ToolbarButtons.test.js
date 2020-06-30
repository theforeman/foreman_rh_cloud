import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ToolbarButtons from '../ToolbarButtons';

const fixtures = {
  'render without Props': {},
};

describe('ToolbarButtons', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ToolbarButtons, fixtures));
});
