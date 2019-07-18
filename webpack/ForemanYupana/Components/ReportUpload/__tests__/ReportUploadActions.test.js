import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  startProcess,
  stopProcess,
  restartProcess,
  downloadReports,
} from '../ReportUploadActions';
import { processID } from '../ReportUpload.fixtures';
import { yupana } from '../../Dashboard/Dashboard.fixtures';

const fixtures = {
  'should startProcess': () => startProcess(),
  'should stopProcess': () => stopProcess(processID),
  'should restartProcess': () => restartProcess(),
  'should downloadReports': () => downloadReports(),
};

beforeEach(() => {
  window.__yupana__ = yupana;
});

describe('ReportUpload actions', () =>
  testActionSnapshotWithFixtures(fixtures));
