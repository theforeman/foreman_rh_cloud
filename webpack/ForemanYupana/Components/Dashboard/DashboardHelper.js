export const seperator = '--------------------';

export const addLogs = (processName, logs) => {
  window.__yupana__[processName].logs.push(...logs);
};
