import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { fetchLogs, startProcess, stopProcess } from '../ReportUploadActions';
import { processID } from '../ReportUpload.fixtures';

const fixtures = {
  'should fetchLogs': () => fetchLogs(),
  'should startProcess': () => startProcess(),
  'should stopProcess': () => stopProcess(processID),
};

beforeEach(() => {
  window.generatingLogs = ['some-logs'];
});

describe('ReportUpload actions', () =>
  testActionSnapshotWithFixtures(fixtures));
