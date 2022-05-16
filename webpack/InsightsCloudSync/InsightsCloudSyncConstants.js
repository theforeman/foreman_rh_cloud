import { translate as __ } from 'foremanReact/common/I18n';
import { getControllerSearchProps } from 'foremanReact/constants';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const INSIGHTS_CLOUD_SYNC = 'INSIGHTS_CLOUD_SYNC';

export const INSIGHTS_CLOUD_SYNC_TASK = 'INSIGHTS_CLOUD_SYNC_TASK';

export const INSIGHTS_SYNC_PAGE_TITLE = __('Red Hat Insights');

export const INSIGHTS_PATH = foremanUrl('/foreman_rh_cloud/insights_cloud');

export const INSIGHTS_SEARCH_PROPS = {
  ...getControllerSearchProps('/insights_cloud/hits'),
  controller: 'insights_hits',
};
