import Immutable from 'seamless-immutable';

import {
  REPORT_UPLOAD_LOGS_POLLING,
  REPORT_UPLOAD_LOGS_POLLING_START,
  REPORT_UPLOAD_PROCESS_START,
  REPORT_UPLOAD_PROCESS_STOP,
  REPORT_UPLOAD_PROCESS_FINISH,
} from './ReportUploadConstants';

const initialState = Immutable({
  /** insert ReportGenerate state here */
  processID: 0,
  pollingProcessID: 0,
  logs: ['No running process'],
  completed: 0,
  status: 'stopped',
});

export default (state = initialState, action) => {
  const {
    payload: { processID, logs, completed, status, pollingProcessID } = {},
  } = action;
  switch (action.type) {
    case REPORT_UPLOAD_LOGS_POLLING_START:
      return state.merge({
        pollingProcessID,
      });
    case REPORT_UPLOAD_LOGS_POLLING:
      return state.merge({
        logs,
        completed,
      });
    case REPORT_UPLOAD_PROCESS_START:
      return state.merge({
        processID,
        status,
      });
    case REPORT_UPLOAD_PROCESS_STOP:
      return state.merge({
        logs,
        completed,
        status,
      });
    case REPORT_UPLOAD_PROCESS_FINISH:
      return state.merge({
        status,
      });
    default:
      return state;
  }
};
