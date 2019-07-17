import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import Dashboard from '../Dashboard';
import * as props from '../Dashboard.fixtures';

const fixtures = {
  'render without Props': {},
  'with props': props,
};

describe('Dashboard', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Dashboard, fixtures));
});
