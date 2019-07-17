import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { startProcess, stopProcess } from '../ReportGenerateActions';
import { processID } from '../ReportGenerate.fixtures';
import { yupana } from '../../Dashboard/Dashboard.fixtures';

const fixtures = {
  'should startProcess': () => startProcess(),
  'should stopProcess': () => stopProcess(processID),
};

beforeEach(() => {
  window.__yupana__ = yupana;
});

describe('ReportGenerate actions', () =>
  testActionSnapshotWithFixtures(fixtures));
