import Immutable from 'seamless-immutable';

import { YUPANA_POLLING_START, YUPANA_POLLING } from './DashboardConstants';
import { seperator } from './DashboardHelper';

const initialState = Immutable({
  /** insert Dashboard state here */
  logs: {
    generating: ['No running process', seperator],
    uploading: ['No running process', seperator],
  },
  completed: {
    generating: 0,
    uploading: 0,
  },
  pollingProcessID: 0,
  files: [],
});

export default (state = initialState, action) => {
  const { payload: { pollingProcessID, logs, completed, files } = {} } = action;

  switch (action.type) {
    case YUPANA_POLLING_START:
      return state.merge({
        pollingProcessID,
      });
    case YUPANA_POLLING: {
      return state.merge({
        logs,
        completed,
        files,
      });
    }
    default:
      return state;
  }
};
