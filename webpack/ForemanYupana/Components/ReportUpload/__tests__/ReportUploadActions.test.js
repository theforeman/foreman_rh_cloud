import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { startProcess, stopProcess } from '../ReportUploadActions';
import { processID } from '../ReportUpload.fixtures';
import { yupana } from '../../Dashboard/Dashboard.fixtures';

const fixtures = {
  'should startProcess': () => startProcess(),
  'should stopProcess': () => stopProcess(processID),
};

beforeEach(() => {
  window.__yupana__ = yupana;
});

describe('ReportUpload actions', () =>
  testActionSnapshotWithFixtures(fixtures));
