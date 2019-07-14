import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { selectTerminal, selectLogs } from '../TerminalSelectors';

const state = {
  terminal: {
    logs: [],
  },
};

const fixtures = {
  'should return Terminal': () => selectTerminal(state),
  'should return Terminal Logs': () => selectLogs(state),
};

describe('Terminal selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
