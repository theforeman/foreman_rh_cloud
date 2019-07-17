import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectReportUpload,
  selectProcessID,
  selectLogs,
  selectCompleted,
  selectLoading,
} from '../ReportUploadSelectors';
import { processID, status } from '../ReportUpload.fixtures';
import { logs, completed } from '../../Dashboard/Dashboard.fixtures';

const state = {
  uploading: {
    processID,
    status,
  },
  dashboard: {
    logs,
    completed,
  },
};

const fixtures = {
  'should return ReportUpload': () => selectReportUpload(state),
  'should return ReportUpload processID': () => selectProcessID(state),
  'should return ReportUpload logs': () => selectLogs(state),
  'should return ReportUpload completed': () => selectCompleted(state),
  'should return ReportUpload loading': () => selectLoading(state),
};

describe('ReportUpload selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
