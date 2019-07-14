import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectUploadsDashboard,
  selectBool,
} from '../UploadsDashboardSelectors';

const state = {
  ForemanYupana: {
    uploadsDashboard: {
      bool: false,
    },
  },
};

const fixtures = {
  'should return UploadsDashboard': () => selectUploadsDashboard(state),
  'should return UploadsDashboard bool': () => selectBool(state),
};

describe('UploadsDashboard selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
