import { TERMINAL_GET_LOGS } from './TerminalConstants';

export const getLogs = url => dispatch => {
  // Do some API call
  const logs = [];
  const testLogs = [
    'Generating...',
    'Hosts: 1000',
    'writing host 1/1000',
    'writing host 2/1000',
  ];
  setTimeout(logs.push(...testLogs), 1500);
  dispatch({
    type: TERMINAL_GET_LOGS,
    payload: { logs },
  });
};
