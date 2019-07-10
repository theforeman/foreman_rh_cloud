import { noop } from 'patternfly-react';

export const generating = {
  exitCode: 0,
  logs: [
    'Generating...',
    'Hosts: 10,000',
    'writing host 1 / 10,000',
    'writing host 2 / 10,000',
  ],
  processScheduledTime: '23:45',
  onRestart: noop,
};

export const uploading = {
  exitCode: 0,
  files: ['213783213', '213213213', '101763276', '12387892712'],
  logs: ['No running process'],
  onRestart: noop,
  onDownload: noop,
};
