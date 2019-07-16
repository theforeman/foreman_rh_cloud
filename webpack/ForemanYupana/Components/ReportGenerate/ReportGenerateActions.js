import {
  REPORT_GENERATE_LOGS_POLLING,
  REPORT_GENERATE_LOGS_POLLING_START,
  REPORT_GENERATE_PROCESS_START,
  REPORT_GENERATE_PROCESS_STOP,
  REPORT_GENERATE_PROCESS_FINISH,
  REPORT_GENERATE_PROCESS_RESTART,
} from './ReportGenerateConstants';

export const startPolling = pollingProcessID => ({
  type: REPORT_GENERATE_LOGS_POLLING_START,
  payload: {
    pollingProcessID,
  },
});

export const stopPolling = pollingProcessID => {
  clearInterval(pollingProcessID);
  return {
    type: REPORT_GENERATE_LOGS_POLLING_START,
    payload: {
      pollingProcessID,
    },
  };
};

export const fetchLogs = () => ({
  // TODO: Add API call here
  type: REPORT_GENERATE_LOGS_POLLING,
  payload: {
    logs: window.generatingLogs,
    completed: window.generatingPercentage,
  },
});

export const startProcess = () => dispatch => {
  // TODO: Add API call here
  const processID = setInterval(() => {
    const mockLogs = [
      'Generating...',
      'Hosts: 20',
      seperator,
      'writing host 1/20',
    ];
    const getLastLog = () =>
      window.generatingLogs
        ? window.generatingLogs[window.generatingLogs.length - 1]
        : '';
    if (window.generatingLogs === undefined) {
      window.generatingLogs = mockLogs;
    }
    if (getLastLog() === seperator) {
      window.generatingLogs.push(...mockLogs);
    }

    const splittedWords = getLastLog().split(' ');
    const lastWord = splittedWords.pop();
    let amount;
    let total;
    if (lastWord.includes('/')) {
      const splittedAmounts = lastWord.split('/');
      amount = Number(splittedAmounts[0]);
      total = Number(splittedAmounts[1]);
    }
    if (total > 0 && amount === total) {
      clearInterval(processID);
      window.generatingLogs.push('Done!', seperator);
      dispatch({
        type: REPORT_GENERATE_PROCESS_FINISH,
        payload: { status: 'success' },
      });
      return;
    }
    const nextAmount = amount + 1;
    const newLog = `${splittedWords[0]} ${
      splittedWords[1]
    } ${nextAmount}/${total}`;
    window.generatingLogs.push(newLog);
    window.generatingPercentage = parseFloat(
      ((nextAmount * 100) / total).toFixed(2)
    );
  }, 1500);

  dispatch({
    type: REPORT_GENERATE_PROCESS_START,
    payload: {
      processID,
      status: 'running',
    },
  });
};

export const stopProcess = processID => dispatch => {
  // TODO: Add API call here
  clearInterval(processID);
  window.generatingLogs &&
    window.generatingLogs.push('No running process', seperator);
  dispatch({
    type: REPORT_GENERATE_PROCESS_STOP,
    payload: { logs: window.generatingLogs, completed: 0, status: 'stopped' },
  });
};

export const restartProcess = () => {
  window.generatingLogs.push('Restarting...', seperator);
  return {
    type: REPORT_GENERATE_PROCESS_RESTART,
    payload: { logs: window.generatingLogs, completed: 0 },
  };
};

const seperator = '--------------------';
