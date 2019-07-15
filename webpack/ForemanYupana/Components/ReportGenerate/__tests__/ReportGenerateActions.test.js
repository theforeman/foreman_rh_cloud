import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { fetchLogs, startProcess, stopProcess } from '../ReportGenerateActions';
import { processID } from '../ReportGenerate.fixtures';

const fixtures = {
  'should fetchLogs': () => fetchLogs(),
  'should startProcess': () => startProcess({}),
  'should stopProcess': () => stopProcess(processID),
};

describe('ReportGenerate actions', () =>
  testActionSnapshotWithFixtures(fixtures));
