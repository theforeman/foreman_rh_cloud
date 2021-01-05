import { translate as __ } from 'foremanReact/common/I18n';
import { getControllerSearchProps } from 'foremanReact/constants';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const INSIGHTS_CLOUD_SYNC_SUCCESS = 'INSIGHTS_CLOUD_SYNC_SUCCESS';

export const INSIGHTS_SYNC_PAGE_TITLE = __('Red Hat Insights');

export const INSIGHTS_PATH = foremanUrl('/foreman_rh_cloud/insights_cloud');

export const INSIGHTS_SAVE_AND_SYNC_PATH = foremanUrl(
  '/insights_cloud/save_token_and_sync'
);

export const INSIGHTS_SEARCH_PROPS = {
  ...getControllerSearchProps('/insights_cloud/hits'),
  controller: INSIGHTS_PATH,
};
