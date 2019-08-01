import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import AccountList from '../AccountList';
import { props } from '../AccountList.fixtures';

const fixtures = {
  'render with props': props,
};

describe('AccountList', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(AccountList, fixtures));
});
