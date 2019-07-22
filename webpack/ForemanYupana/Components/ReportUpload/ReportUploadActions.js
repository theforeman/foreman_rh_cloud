import {
  REPORT_UPLOAD_PROCESS_START,
  REPORT_UPLOAD_PROCESS_STOP,
  REPORT_UPLOAD_PROCESS_FINISH,
  REPORT_UPLOAD_PROCESS_RESTART,
  REPORT_UPLOAD_FILES_DOWNLOAD,
} from './ReportUploadConstants';
import { seperator, addLogs } from '../Dashboard/DashboardHelper';

const addUploadingLogs = logs => addLogs('uploading', logs);

export const startProcess = () => dispatch => {
  // TODO: Add API call here
  const processID = setInterval(() => {
    const mockLogs = [
      'Uploading...',
      'Reports: 10',
      seperator,
      'writing report 1/10',
    ];

    const { uploading } = window.__yupana__;
    const getLastLog = () => uploading.logs[uploading.logs.length - 1];
    if (getLastLog() === seperator) {
      addUploadingLogs(mockLogs);
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
      addUploadingLogs(['Done!', seperator]);
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
    addUploadingLogs([newLog]);
    uploading.completed = parseFloat(((nextAmount * 100) / total).toFixed(2));
    uploading.files = ['213783213', '213213213', '101763276', '12387892712'];
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
  addUploadingLogs(['No running process', seperator]);
  dispatch({
    type: REPORT_UPLOAD_PROCESS_STOP,
    payload: { status: 'stopped' },
  });
};

export const restartProcess = () => {
  addUploadingLogs(['Restarting', seperator]);
  return {
    type: REPORT_UPLOAD_PROCESS_RESTART,
  };
};

export const downloadReports = () => dispatch => {
  // TODO: Add API call here
  setTimeout(() => {
    const response = {
      file:
        'https://download.fedoraproject.org/pub/fedora/linux/releases/30/Workstation/x86_64/iso/Fedora-Workstation-netinst-x86_64-30-1.2.iso',
    };
    // server sent the url to the file!
    // now, let's download:
    window.location.href = response.file;
  }, 100);
  dispatch({
    type: REPORT_UPLOAD_FILES_DOWNLOAD,
  });
};
