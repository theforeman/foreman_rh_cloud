import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  REPORT_UPLOAD_LOGS_POLLING,
  REPORT_UPLOAD_PROCESS_START,
  REPORT_UPLOAD_PROCESS_STOP,
  REPORT_UPLOAD_PROCESS_FINISH,
} from '../ReportUploadConstants';
import reducer from '../ReportUploadReducer';
import {
  logs,
  completed,
  processID,
  pollingProcessID,
  status,
} from '../ReportUpload.fixtures';

const fixtures = {
  'should return the initial state': {},
  'should handle REPORT_UPLOAD_LOGS_POLLING_START': {
    action: {
      type: REPORT_UPLOAD_LOGS_POLLING,
      payload: {
        pollingProcessID,
      },
    },
    'should handle REPORT_UPLOAD_LOGS_POLLING': {
      action: {
        type: REPORT_UPLOAD_LOGS_POLLING,
        payload: {
          logs,
          completed,
        },
      },
      'should handle REPORT_UPLOAD_PROCESS_START': {
        action: {
          type: REPORT_UPLOAD_PROCESS_START,
          payload: {
            processID,
            status,
          },
        },
      },
      'should handle REPORT_UPLOAD_PROCESS_STOP': {
        action: {
          type: REPORT_UPLOAD_PROCESS_STOP,
          payload: {
            logs,
            completed,
            status,
          },
        },
      },
      'should handle REPORT_UPLOAD_PROCESS_FINISH': {
        action: {
          type: REPORT_UPLOAD_PROCESS_FINISH,
          payload: {
            status,
          },
        },
      },
    },
  },
};

describe('ReportUpload reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
