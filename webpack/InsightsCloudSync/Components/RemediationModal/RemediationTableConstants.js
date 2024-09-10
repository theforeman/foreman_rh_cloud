import React from 'react';
import { cellWidth } from '@patternfly/react-table';
import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';

export const rebootFormatter = ({ title: reboot }) => ({
  children: reboot ? <Icon color="green"><CheckCircleIcon /></Icon> : __('No'),
});

export const columns = [
  {
    sortKey: 'hostname',
    title: __('Hostname'),
    transforms: [cellWidth(20)],
  },
  {
    title: __('Recommendation'),
    transforms: [cellWidth(35)],
  },
  {
    title: __('Resolution'),
    transforms: [cellWidth(30)],
  },
  {
    title: __('Reboot Required'),
    transforms: [cellWidth(15)],
    cellTransforms: [rebootFormatter],
  },
];

export const REMEDIATIONS_PATH = foremanUrl('/insights_cloud/hits/resolutions');

export const JOB_INVOCATION_PATH = foremanUrl('/job_invocations/new');

export const REMEDIATIONS_API_KEY = 'INSIGHTS_REMEDIATIONS';

export const SUBMIT_RESOLUTIONS = 'SUBMIT_INSIGHTS_RESOLUTIONS';
