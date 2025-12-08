import React from 'react';
import { Spinner } from '@patternfly/react-core';
import { CheckIcon, TimesIcon } from '@patternfly/react-icons';

const STATUS_ICONS = {
  success: <CheckIcon />,
  failure: <TimesIcon />,
  running: <Spinner size="sm" />,
  unknown: <span>--</span>,
};

export const getStatusIconByRegex = status => {
  if (!status || status === 'unknown') {
    return STATUS_ICONS.unknown;
  }

  const statusLower = status.toLowerCase();

  // Success states
  if (statusLower === 'success') {
    return STATUS_ICONS.success;
  }

  // Running states
  if (
    statusLower === 'running' ||
    statusLower === 'pending' ||
    statusLower === 'scheduled'
  ) {
    return STATUS_ICONS.running;
  }

  // Failure states (error, warning, or anything else)
  return STATUS_ICONS.failure;
};
