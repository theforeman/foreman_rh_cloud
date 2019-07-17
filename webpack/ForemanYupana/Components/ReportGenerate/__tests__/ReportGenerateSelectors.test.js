import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectReportGenerate,
  selectProcessID,
  selectLogs,
  selectCompleted,
  selectLoading,
} from '../ReportGenerateSelectors';
import { processID, status } from '../ReportGenerate.fixtures';
import { logs, completed } from '../../Dashboard/Dashboard.fixtures';

const state = {
  generating: {
    processID,
    status,
  },
  dashboard: {
    logs,
    completed,
  },
};

const fixtures = {
  'should return ReportGenerate': () => selectReportGenerate(state),
  'should return ReportGenerate processID': () => selectProcessID(state),
  'should return ReportGenerate logs': () => selectLogs(state),
  'should return ReportGenerate completed': () => selectCompleted(state),
  'should return ReportGenerate loading': () => selectLoading(state),
};

describe('ReportGenerate selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
