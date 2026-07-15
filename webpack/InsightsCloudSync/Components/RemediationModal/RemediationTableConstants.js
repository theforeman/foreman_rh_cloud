import React from 'react';
import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';

export const rebootFormatter = reboot =>
  reboot ? (
    <Icon color="green">
      <CheckCircleIcon />
    </Icon>
  ) : (
    __('No')
  );

export const columns = [
  {
    id: 'hostname',
    sortKey: 'hostname',
    title: __('Hostname'),
    width: 20,
  },
  {
    id: 'recommendation',
    title: __('Recommendation'),
    width: 35,
  },
  {
    id: 'resolution',
    title: __('Resolution'),
    width: 30,
  },
  {
    id: 'reboot',
    title: __('Reboot Required'),
    width: 15,
    formatter: rebootFormatter,
  },
];

export const REMEDIATIONS_PATH = foremanUrl('/insights_cloud/hits/resolutions');

export const JOB_INVOCATION_PATH = foremanUrl('/job_invocations/new');

export const REMEDIATIONS_API_KEY = 'INSIGHTS_REMEDIATIONS';

export const SUBMIT_RESOLUTIONS = 'SUBMIT_INSIGHTS_RESOLUTIONS';

// Brief delay before the (non-React) form submit/navigation fires, so the
// button's isLoading spinner has a chance to render first.
export const FORM_SUBMIT_DELAY_MS = 100;
