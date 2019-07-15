import Immutable from 'seamless-immutable';

import {
  REPORT_GENERATE_LOGS_POLLING,
  REPORT_GENERATE_START,
  REPORT_GENERATE_STOP,
  REPORT_GENERATE_FINISH,
} from './ReportGenerateConstants';

const initialState = Immutable({
  /** insert ReportGenerate state here */
  processID: 0,
  logs: ['No running process'],
  completed: 0,
  status: 'stopped',
});

export default (state = initialState, action) => {
  const { payload: { processID, logs, completed, status } = {} } = action;

  switch (action.type) {
    case REPORT_GENERATE_LOGS_POLLING:
      return state.merge({
        logs,
        completed,
      });
    case REPORT_GENERATE_START:
      return state.merge({
        processID,
        logs,
        completed,
        status,
      });
    case REPORT_GENERATE_STOP:
      return state.merge({
        logs,
        completed,
        status,
      });
    case REPORT_GENERATE_FINISH:
      return state.merge({
        status,
      });
    default:
      return state;
  }
};
