import React from 'react';
import { post } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { insightsCloudUrl } from './InsightsCloudSyncHelpers';
import { INSIGHTS_CLOUD_SYNC } from './InsightsCloudSyncConstants';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const syncInsights = () =>
  post({
    key: INSIGHTS_CLOUD_SYNC,
    url: insightsCloudUrl('tasks'),
    successToast: response => (
      <span>
        {__('Recommendation sync has started: ')}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={foremanUrl(`/foreman_tasks/tasks/${response.data?.task?.id}`)}
        >
          {__('view the task in progress')}
        </a>
      </span>
    ),
    errorToast: error => `${__('Recommendation sync has failed: ')} ${error}`,
  });
