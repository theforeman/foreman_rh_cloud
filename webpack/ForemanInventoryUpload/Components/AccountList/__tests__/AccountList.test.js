import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AccountList from '../AccountList';
import { props } from '../AccountList.fixtures';

const fixtures = {
  'render with props': props,
};

describe('AccountList', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(AccountList, fixtures));
});
