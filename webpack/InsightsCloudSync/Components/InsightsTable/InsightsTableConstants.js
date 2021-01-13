/* eslint-disable camelcase */
import React from 'react';
import {
  InsightsLabel,
  Section,
} from '@redhat-cloud-services/frontend-components';
import { sortable, cellWidth } from '@patternfly/react-table';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';

export const totalRiskFormatter = ({ title: totalRisk }) => ({
  children: (
    <Section className="insights-total-risk" type="icon-group">
      <InsightsLabel value={totalRisk} />
    </Section>
  ),
});

export const columns = [
  {
    sortKey: 'hostname',
    title: __('Hostname'),
    transforms: [cellWidth(20), sortable],
  },
  {
    sortKey: 'title',
    title: __('Recommendation'),
    transforms: [cellWidth(60), sortable],
  },
  {
    sortKey: 'total_risk',
    title: __('Total Risk'),
    transforms: [cellWidth(20), sortable],
    cellTransforms: [totalRiskFormatter],
  },
];

export const actions = [
  {
    title: __('Remediate'),
    onClick: (event, rowId, rowData, extra) => {
      alert('Remediate!');
    },
  },
];

export const INSIGHTS_HITS_PATH = foremanUrl('/insights_cloud/hits');

export const INSIGHTS_HITS_API_KEY = 'INSIGHTS_HITS';

export const INSIGHTS_SET_SELECTED_IDS = 'INSIGHTS_SET_SELECTED_IDS';

export const INSIGHTS_SET_SELECT_ALL_ALERT = 'INSIGHTS_SET_SELECT_ALL_ALERT';

export const INSIGHTS_SET_SELECT_ALL = 'INSIGHTS_SET_SELECT_ALL';
