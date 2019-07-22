import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectReportUpload,
  selectProcessID,
  selectLogs,
  selectCompleted,
  selectLoading,
  selectExitCode,
  selectFiles,
} from '../ReportUploadSelectors';
import { processID, status } from '../ReportUpload.fixtures';
import {
  logs,
  completed,
  pollingProcessID,
  files,
} from '../../Dashboard/Dashboard.fixtures';

const state = {
  uploading: {
    processID,
    status,
  },
  dashboard: {
    uploading: {
      logs,
      completed,
      files,
    },
    pollingProcessID,
  },
};

const fixtures = {
  'should return ReportUpload': () => selectReportUpload(state),
  'should return ReportUpload processID': () => selectProcessID(state),
  'should return ReportUpload logs': () => selectLogs(state),
  'should return ReportUpload completed': () => selectCompleted(state),
  'should return ReportUpload files': () => selectFiles(state),
  'should return ReportUpload loading': () => selectLoading(state),
  'should return ReportUpload exitCode': () => selectExitCode(state),
  'should return ReportUpload exitCode 0': () =>
    selectExitCode({ uploading: { status: 'success' } }),
  'should return ReportUpload exitCode 1': () =>
    selectExitCode({ uploading: { status: 'failure' } }),
};

describe('ReportUpload selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
