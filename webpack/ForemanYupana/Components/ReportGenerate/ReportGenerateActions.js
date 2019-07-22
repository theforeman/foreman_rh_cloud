import {
  REPORT_GENERATE_PROCESS_START,
  REPORT_GENERATE_PROCESS_STOP,
  REPORT_GENERATE_PROCESS_FINISH,
  REPORT_GENERATE_PROCESS_RESTART,
} from './ReportGenerateConstants';
import { seperator, addLogs } from '../Dashboard/DashboardHelper';

const addGeneratingLogs = logs => addLogs('generating', logs);

export const startProcess = () => dispatch => {
  // TODO: Add API call here
  const processID = setInterval(() => {
    const mockLogs = [
      'Generating...',
      'Hosts: 20',
      seperator,
      'writing host 1/20',
    ];

    const { generating } = window.__yupana__;
    const getLastLog = () => generating.logs[generating.logs.length - 1];

    if (getLastLog() === seperator) {
      addGeneratingLogs(mockLogs);
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
      addGeneratingLogs(['Done!', seperator]);
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
    addGeneratingLogs([newLog]);
    generating.completed = parseFloat(((nextAmount * 100) / total).toFixed(2));
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
  addGeneratingLogs(['No running process', seperator]);
  dispatch({
    type: REPORT_GENERATE_PROCESS_STOP,
    payload: { status: 'stopped' },
  });
};

export const restartProcess = () => {
  addGeneratingLogs(['Restarting...', seperator]);
  return {
    type: REPORT_GENERATE_PROCESS_RESTART,
  };
};
