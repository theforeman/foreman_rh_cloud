import Immutable from 'seamless-immutable';

import { TERMINAL_GET_LOGS } from './TerminalConstants';

const initialState = Immutable({
  logs: ['No running process'],
});

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case TERMINAL_GET_LOGS:
      return state.set('logs', payload.logs);

    default:
      return state;
  }
};
