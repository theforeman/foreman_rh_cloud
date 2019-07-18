import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import NavContainer from '../NavContainer';
import { props } from '../NavContainer.fixtures';

const fixtures = {
  'render without Props': {},
  'render with Props': props,
};

describe('NavContainer', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(NavContainer, fixtures));
});
