import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ScheduledRun from '../ScheduledRun';
import { props } from '../ScheduledRun.fixtures';

const fixtures = {
  'render without Props': {},
  'render with Props': props,
};

describe('ScheduledRun', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ScheduledRun, fixtures));
});
