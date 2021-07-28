/* eslint-disable camelcase */
import React from 'react';
import {
  InsightsLabel,
  Section,
} from '@redhat-cloud-services/frontend-components';
import { sortable, cellWidth } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';

export const totalRiskFormatter = ({ title: totalRisk }) => ({
  children: (
    <Section className="insights-total-risk" type="icon-group">
      <InsightsLabel value={totalRisk} />
    </Section>
  ),
});

export const hasPlaybookFormatter = ({ title: hasPlaybook }) => ({
  children: hasPlaybook ? <CheckCircleIcon color="green" /> : __('No'),
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
    transforms: [cellWidth(50), sortable],
  },
  {
    sortKey: 'total_risk',
    title: __('Total Risk'),
    transforms: [cellWidth(15), sortable],
    cellTransforms: [totalRiskFormatter],
  },
  {
    title: __('Playbook'),
    transforms: [cellWidth(15)],
    cellTransforms: [hasPlaybookFormatter],
  },
];

export const paginationTitles = {
  items: __('items'),
  page: __('page'),
  itemsPerPage: __('Items per page'),
  perPageSuffix: __('per page'),
  toFirstPage: __('Go to first page'),
  toPreviousPage: __('Go to previous page'),
  toLastPage: __('Go to last page'),
  toNextPage: __('Go to next page'),
  optionsToggle: __('Items per page'),
  currPage: __('Current page'),
  paginationTitle: __('Pagination'),
};

export const INSIGHTS_HITS_PATH = foremanUrl('/insights_cloud/hits');

export const INSIGHTS_HITS_API_KEY = 'INSIGHTS_HITS';

export const INSIGHTS_SET_SELECTED_IDS = 'INSIGHTS_SET_SELECTED_IDS';

export const INSIGHTS_SET_SELECT_ALL_ALERT = 'INSIGHTS_SET_SELECT_ALL_ALERT';

export const INSIGHTS_SET_SELECT_ALL = 'INSIGHTS_SET_SELECT_ALL';
