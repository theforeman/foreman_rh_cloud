import {
  REPORT_GENERATE_PROCESS_START,
  REPORT_GENERATE_PROCESS_STOP,
  REPORT_GENERATE_PROCESS_FINISH,
  REPORT_GENERATE_PROCESS_RESTART,
} from './ReportGenerateConstants';
import { seperator } from '../Dashboard/DashboardHelper';

export const startProcess = () => dispatch => {
  // TODO: Add API call here
  const processID = setInterval(() => {
    const mockLogs = [
      'Generating...',
      'Hosts: 20',
      seperator,
      'writing host 1/20',
    ];
    const { generating } = window.__yupana__.logs;
    const getLastLog = () => generating[generating.length - 1];

    if (getLastLog() === seperator) {
      generating.push(...mockLogs);
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
      generating.push('Done!', seperator);
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
    generating.push(newLog);
    window.__yupana__.completed.generating = parseFloat(
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
  window.__yupana__.logs.generating.push('No running process', seperator);
  dispatch({
    type: REPORT_GENERATE_PROCESS_STOP,
    payload: { status: 'stopped' },
  });
};

export const restartProcess = () => {
  window.__yupana__.logs.generating.push('Restarting...', seperator);
  return {
    type: REPORT_GENERATE_PROCESS_RESTART,
  };
};
