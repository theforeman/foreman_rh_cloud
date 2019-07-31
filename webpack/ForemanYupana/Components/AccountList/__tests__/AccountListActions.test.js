import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { changeBool } from '../AccountListActions';

const fixtures = {
  'should changeBool': () => changeBool({ bool: true }),
};

describe('AccountList actions', () => testActionSnapshotWithFixtures(fixtures));
