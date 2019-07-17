import Immutable from 'seamless-immutable';

import {
  REPORT_UPLOAD_PROCESS_START,
  REPORT_UPLOAD_PROCESS_STOP,
  REPORT_UPLOAD_PROCESS_FINISH,
} from './ReportUploadConstants';

const initialState = Immutable({
  /** insert ReportGenerate state here */
  processID: 0,
  status: 'stopped',
});

export default (state = initialState, action) => {
  const { payload: { processID, status } = {} } = action;
  switch (action.type) {
    case REPORT_UPLOAD_PROCESS_START:
      return state.merge({
        processID,
        status,
      });
    case REPORT_UPLOAD_PROCESS_STOP:
      return state.merge({
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
