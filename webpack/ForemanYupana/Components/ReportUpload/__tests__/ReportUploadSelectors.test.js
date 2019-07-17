import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectReportUpload,
  selectProcessID,
  selectLogs,
  selectCompleted,
  selectLoading,
} from '../ReportUploadSelectors';
import { logs, completed, processID, status } from '../ReportUpload.fixtures';

const state = {
  uploading: {
    processID,
    logs,
    completed,
    status,
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
