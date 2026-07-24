/* eslint-disable camelcase */
import React from 'react';
import { DropdownItem } from '@patternfly/react-core';
import { AnsibeTowerIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../ForemanRhCloudHelpers';
import DropdownToggle from '../../../common/DropdownToggle';
import InsightsSection from './InsightsSection';
import InsightsLabel from './InsightsLabel';

export const totalRiskFormatter = totalRisk => (
  <InsightsSection className="insights-total-risk" type="icon-group">
    <InsightsLabel value={totalRisk} />
  </InsightsSection>
);

export const hasPlaybookFormatter = hasPlaybook =>
  hasPlaybook ? (
    <span className="td-insights-remediate-playbook">
      <AnsibeTowerIcon />
      {__('Playbook')}
    </span>
  ) : (
    <span className="td-insights-remediate-manual">{__('Manual')}</span>
  );

export const actionsFormatter = rowData => {
  const { recommendationUrl, accessRHUrl, isLocalAdvisorEngine } = rowData;
  const dropdownItems = [];

  recommendationUrl &&
    !isLocalAdvisorEngine &&
    dropdownItems.push(
      <DropdownItem key="recommendation-url" ouiaId="insights-dropdown-item-recommendation-url">
        <a href={recommendationUrl} target="_blank" rel="noopener noreferrer">
          {__('View in Red Hat Insights')} <ExternalLinkAltIcon />
        </a>
      </DropdownItem>
    );

  accessRHUrl &&
    dropdownItems.push(
      <DropdownItem key="access-url" ouiaId="insights-dropdown-item-knowledgebase">
        <a href={accessRHUrl} target="_blank" rel="noopener noreferrer">
          {__('Knowledgebase article')} <ExternalLinkAltIcon />
        </a>
      </DropdownItem>
    );

  return <DropdownToggle items={dropdownItems} />;
};

export const columns = [
  {
    id: 'hostname',
    sortKey: 'hostname',
    title: __('Hostname'),
    width: 20,
  },
  {
    id: 'recommendation',
    sortKey: 'title',
    title: __('Recommendation'),
    width: 50,
  },
  {
    id: 'total_risk',
    sortKey: 'total_risk',
    title: __('Total risk'),
    width: 15,
    formatter: totalRiskFormatter,
  },
  {
    id: 'has_playbook',
    title: __('Remediate'),
    width: 10,
    formatter: hasPlaybookFormatter,
  },
  {
    id: 'actions',
    title: '',
    width: 5,
    formatter: actionsFormatter,
  },
];

export const getColumnsWithoutHostname = () => {
  return columns
    .slice(1)
    .map(col => (col.id === 'recommendation' ? { ...col, width: 70 } : col));
};

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

export const ADVISOR_ENGINE_CONFIG_KEY = 'ADVISOR_ENGINE_CONFIG';

export const ADVISOR_ENGINE_CONFIG_PATH = foremanUrl(
  '/api/v2/rh_cloud/advisor_engine_config'
);

export const NEW_HOST_PATH = '/new/hosts/';
