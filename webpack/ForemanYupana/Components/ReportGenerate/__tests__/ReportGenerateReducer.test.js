import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  REPORT_GENERATE_LOGS_POLLING,
  REPORT_GENERATE_PROCESS_START,
  REPORT_GENERATE_PROCESS_STOP,
  REPORT_GENERATE_PROCESS_FINISH,
} from '../ReportGenerateConstants';
import reducer from '../ReportGenerateReducer';
import {
  logs,
  completed,
  processID,
  pollingProcessID,
  status,
} from '../ReportGenerate.fixtures';

const fixtures = {
  'should return the initial state': {},
  'should handle REPORT_GENERATE_LOGS_POLLING_START': {
    action: {
      type: REPORT_GENERATE_LOGS_POLLING,
      payload: {
        pollingProcessID,
      },
    },
    'should handle REPORT_GENERATE_LOGS_POLLING': {
      action: {
        type: REPORT_GENERATE_LOGS_POLLING,
        payload: {
          logs,
          completed,
        },
      },
      'should handle REPORT_GENERATE_PROCESS_START': {
        action: {
          type: REPORT_GENERATE_PROCESS_START,
          payload: {
            processID,
            status,
          },
        },
      },
      'should handle REPORT_GENERATE_PROCESS_STOP': {
        action: {
          type: REPORT_GENERATE_PROCESS_STOP,
          payload: {
            logs,
            completed,
            status,
          },
        },
      },
      'should handle REPORT_GENERATE_PROCESS_FINISH': {
        action: {
          type: REPORT_GENERATE_PROCESS_FINISH,
          payload: {
            status,
          },
        },
      },
    },
  },
};

describe('ReportGenerate reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
