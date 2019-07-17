import {
  REPORT_UPLOAD_LOGS_POLLING,
  REPORT_UPLOAD_LOGS_POLLING_START,
  REPORT_UPLOAD_PROCESS_START,
  REPORT_UPLOAD_PROCESS_STOP,
  REPORT_UPLOAD_PROCESS_FINISH,
  REPORT_UPLOAD_PROCESS_RESTART,
} from './ReportUploadConstants';

export const startPolling = pollingProcessID => ({
  type: REPORT_UPLOAD_LOGS_POLLING_START,
  payload: {
    pollingProcessID,
  },
});

export const stopPolling = pollingProcessID => {
  clearInterval(pollingProcessID);
  return {
    type: REPORT_UPLOAD_LOGS_POLLING_START,
    payload: {
      pollingProcessID,
    },
  };
};

export const fetchLogs = () => ({
  // TODO: Add API call here
  type: REPORT_UPLOAD_LOGS_POLLING,
  payload: {
    logs: window.uploadingLogs,
    completed: window.uploadingPercentage,
  },
});

export const startProcess = () => dispatch => {
  // TODO: Add API call here
  const processID = setInterval(() => {
    const mockLogs = [
      'Uploading...',
      'Reports: 4',
      seperator,
      'writing report 1/4',
    ];
    const getLastLog = () =>
      window.uploadingLogs
        ? window.uploadingLogs[window.uploadingLogs.length - 1]
        : '';
    if (window.uploadingLogs === undefined) {
      window.uploadingLogs = mockLogs;
    }
    if (getLastLog() === seperator) {
      window.uploadingLogs.push(...mockLogs);
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
      window.uploadingLogs.push('Done!', seperator);
      dispatch({
        type: REPORT_UPLOAD_PROCESS_FINISH,
        payload: { status: 'success' },
      });
      return;
    }
    const nextAmount = amount + 1;
    const newLog = `${splittedWords[0]} ${
      splittedWords[1]
    } ${nextAmount}/${total}`;
    window.uploadingLogs.push(newLog);
    window.uploadingPercentage = parseFloat(
      ((nextAmount * 100) / total).toFixed(2)
    );
  }, 3000);

  dispatch({
    type: REPORT_UPLOAD_PROCESS_START,
    payload: {
      processID,
      status: 'running',
    },
  });
};

export const stopProcess = processID => dispatch => {
  // TODO: Add API call here
  clearInterval(processID);
  window.uploadingLogs &&
    window.uploadingLogs.push('No running process', seperator);
  dispatch({
    type: REPORT_UPLOAD_PROCESS_STOP,
    payload: { logs: window.uploadingLogs, completed: 0, status: 'stopped' },
  });
};

export const restartProcess = () => {
  window.uploadingLogs.push('Restarting...', seperator);
  return {
    type: REPORT_UPLOAD_PROCESS_RESTART,
    payload: { logs: window.uploadingLogs, completed: 0 },
  };
};

const seperator = '--------------------';
