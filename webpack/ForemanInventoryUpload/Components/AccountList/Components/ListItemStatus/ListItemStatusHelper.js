import React from 'react';
import { Icon, Spinner } from 'patternfly-react';

const STATUS_ICONS = {
  success: <Icon name="check" />,
  failure: <Icon name="times" />,
  running: <Spinner loading inline size="xs" />,
  unknown: <span>--</span>,
};

export const getStatusIconByRegex = status => {
  if (!status || status === 'unknown') {
    return STATUS_ICONS.unknown;
  }

  const statusCopy = status.toLowerCase();
  if (statusCopy.indexOf('exit 0') !== -1) {
    return STATUS_ICONS.success;
  }

  if (
    statusCopy.indexOf('running') !== -1 ||
    statusCopy.indexOf('restarting') !== -1
  ) {
    return STATUS_ICONS.running;
  }

  return STATUS_ICONS.failure;
};
