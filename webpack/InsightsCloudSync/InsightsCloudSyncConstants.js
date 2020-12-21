import { translate as __ } from 'foremanReact/common/I18n';
import { getControllerSearchProps } from 'foremanReact/constants';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const INSIGHTS_CLOUD_SYNC_SUCCESS = 'INSIGHTS_CLOUD_SYNC_SUCCESS';
export const INSIGHTS_SYNC_PAGE_TITLE = __('Red Hat Insights');
export const INSIGHTS_PATH = foremanUrl('/foreman_rh_cloud/insights_cloud');
export const INSIGHTS_HITS_PATH = '/insights_cloud/hits';
export const INSIGHTS_HITS_API_KEY = 'INSIGHTS_HITS';
export const INSIGHTS_SEARCH_PROPS = {
  ...getControllerSearchProps('/insights_cloud/hits'),
  controller: INSIGHTS_PATH,
};
