import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import AccountList from '../AccountList';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('AccountList', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(AccountList, fixtures));
});
