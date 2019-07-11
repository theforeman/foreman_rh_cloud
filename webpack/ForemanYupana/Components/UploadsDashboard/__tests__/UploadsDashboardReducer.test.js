import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import { UPLOADSDASHBOARD_CHANGE_BOOL } from '../UploadsDashboardConstants';
import reducer from '../UploadsDashboardReducer';

const fixtures = {
  'should return the initial state': {},
  'should handle UPLOADSDASHBOARD_CHANGE_BOOL': {
    action: {
      type: UPLOADSDASHBOARD_CHANGE_BOOL,
      payload: {
        bool: true,
      },
    },
  },
};

describe('UploadsDashboard reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
