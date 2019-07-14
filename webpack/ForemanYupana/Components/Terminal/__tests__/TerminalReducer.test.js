import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import { TERMINAL_GET_LOGS } from '../TerminalConstants';
import reducer from '../TerminalReducer';
import { logs } from '../Terminal.fixtures';

const fixtures = {
  'should return the initial state': {},
  'should handle TERMINAL_CHANGE_BOOL': {
    action: {
      type: TERMINAL_GET_LOGS,
      payload: {
        logs,
      },
    },
  },
};

describe('Terminal reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
