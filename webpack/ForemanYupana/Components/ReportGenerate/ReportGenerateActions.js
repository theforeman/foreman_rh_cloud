import {
  REPORT_GENERATE_LOGS_POLLING,
  REPORT_GENERATE_START,
  REPORT_GENERATE_STOP,
  REPORT_GENERATE_FINISH,
} from './ReportGenerateConstants';

export const fetchLogs = () => dispatch => {
  // TODO: Add API call here
  dispatch({
    type: REPORT_GENERATE_LOGS_POLLING,
    payload: {
      logs: window.generatingLogs,
      completed: window.generatingPercentage,
    },
  });
};

export const startProcess = () => dispatch => {
  // TODO: Add API call here
  window.generatingLogs = [
    'Generating...',
    'Hosts: 20',
    'writing host 1/20',
    'writing host 2/20',
  ];

  const logs = window.generatingLogs;
  const processID = setInterval(() => {
    const lastLog = logs[logs.length - 1];
    const splittedWords = lastLog.split(' ');
    const lastWord = splittedWords.pop();
    let amount;
    let total;
    if (lastWord.includes('/')) {
      const splittedAmounts = lastWord.split('/');
      amount = Number(splittedAmounts[0]);
      total = Number(splittedAmounts[1]);
    }
    if (amount === total) {
      clearInterval(processID);
      dispatch({
        type: REPORT_GENERATE_FINISH,
        payload: { status: 'finished' },
      });
      return;
    }
    const nextAmount = amount + 1;
    const newLog = `${splittedWords[0]} ${
      splittedWords[1]
    } ${nextAmount}/${total}`;
    window.generatingLogs.push(newLog);
    window.generatingPercentage = (nextAmount * 100) / total;
  }, 1500);

  dispatch({
    type: REPORT_GENERATE_START,
    payload: {
      processID,
      logs: window.generatingLogs,
      completed: window.generatingPercentage,
      status: 'running',
    },
  });
};

export const stopProcess = processID => dispatch => {
  // TODO: Add API call here
  clearInterval(processID);
  dispatch({
    type: REPORT_GENERATE_STOP,
    payload: { logs: ['No running process'], completed: 0, status: 'stopped' },
  });
};
