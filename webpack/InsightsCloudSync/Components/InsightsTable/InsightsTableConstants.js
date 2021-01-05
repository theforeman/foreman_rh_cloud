/* eslint-disable camelcase */
import { sortable, cellWidth } from '@patternfly/react-table';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';

export const columns = [
  {
    sortKey: 'hostname',
    title: __('Hostname'),
    transforms: [cellWidth(20), sortable],
  },
  {
    sortKey: 'title',
    title: __('Recommendation'),
    transforms: [cellWidth(65), sortable],
  },
  {
    sortKey: 'total_risk',
    title: __('Total Risk'),
    transforms: [cellWidth(15), sortable],
  },
];

export const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
];

export const actions = [
  // {
  //   title: __('Remediate'),
  //   onClick: (event, rowId, rowData, extra) => {
  //     alert('Remediate!');
  //   },
  // },
];

export const INSIGHTS_HITS_PATH = foremanUrl('/insights_cloud/hits');

export const INSIGHTS_HITS_API_KEY = 'INSIGHTS_HITS';

export const INSIGHTS_SET_SELECTED_IDS = 'INSIGHTS_SET_SELECTED_IDS';

export const INSIGHTS_HIDE_SELECT_ALL_ALERT = 'INSIGHTS_HIDE_SELECT_ALL_ALERT';
