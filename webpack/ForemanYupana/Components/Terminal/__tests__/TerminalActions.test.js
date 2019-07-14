import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { getLogs } from '../TerminalActions';

const fixtures = {
  'should getLogs': () => getLogs(),
};

describe('Terminal actions', () => testActionSnapshotWithFixtures(fixtures));
