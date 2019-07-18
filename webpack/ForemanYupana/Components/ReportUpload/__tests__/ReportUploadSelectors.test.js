import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectReportUpload,
  selectProcessID,
  selectLogs,
  selectCompleted,
  selectLoading,
  selectExitCode,
} from '../ReportUploadSelectors';
import { processID, status } from '../ReportUpload.fixtures';
import {
  logs,
  completed,
  pollingProcessID,
} from '../../Dashboard/Dashboard.fixtures';

const state = {
  uploading: {
    processID,
    status,
  },
  dashboard: {
    logs,
    completed,
    pollingProcessID,
  },
};

const fixtures = {
  'should return ReportUpload': () => selectReportUpload(state),
  'should return ReportUpload processID': () => selectProcessID(state),
  'should return ReportUpload logs': () => selectLogs(state),
  'should return ReportUpload completed': () => selectCompleted(state),
  'should return ReportUpload loading': () => selectLoading(state),
  'should return ReportUpload exitCode': () => selectExitCode(state),
  'should return ReportUpload exitCode 0': () =>
    selectExitCode({ uploading: { status: 'success' } }),
  'should return ReportUpload exitCode 1': () =>
    selectExitCode({ uploading: { status: 'failure' } }),
};

describe('ReportUpload selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
