import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import InsightsTab from '../InsightsTab';
import { props } from './InsightsTab.fixtures';

const fixtures = {
  'render with props': props,
};

describe('InsightsTab', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InsightsTab, fixtures));
});
