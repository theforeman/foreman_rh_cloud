import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import { translate as __ } from 'foremanReact/common/I18n';
import InventoryAutoUploadSwitcher from './ForemanInventoryUpload/SubscriptionsPageExtension/InventoryAutoUpload';
import NewHostDetailsTab from './InsightsHostDetailsTab/NewHostDetailsTab';
import { InsightsTotalRiskChartWrapper } from './InsightsHostDetailsTab/InsightsTotalRiskChartWrapper';
import {
  isNotRhelHost,
  vulnerabilityDisabled,
  hasNoInsightsFacet,
} from './ForemanRhCloudHelpers';
import CVEsHostDetailsTabWrapper from './CVEsHostDetailsTab/CVEsHostDetailsTab';
import ComplianceHostDetailsTabWrapper from './ComplianceHostDetailsTab/ComplianceHostDetailsTab';
import InsightsVulnerabilityActionsBar from './InsightsVulnerabilityActionsBar';

const fills = [
  {
    slot: 'katello-manage-manifest-form',
    name: 'InventoryAutoUpload',
    component: () => <InventoryAutoUploadSwitcher />,
    weight: 50,
  },
  {
    slot: 'hosts-index-kebab',
    name: 'InsightsVulnerabilityActionsBar',
    component: () => <InsightsVulnerabilityActionsBar />,
    weight: 150,
  },
  {
    slot: 'host-details-page-tabs',
    name: 'Insights',
    component: props => <NewHostDetailsTab {...props} />,
    weight: 400,
    metadata: {
      hideTab: props => isNotRhelHost(props) || hasNoInsightsFacet(props),
      title: __('Recommendations'),
    },
  },
  {
    slot: 'host-overview-cards',
    name: 'insights-total-risk-chart',
    component: props => <InsightsTotalRiskChartWrapper {...props} />,
    weight: 2800,
  },
  {
    slot: 'host-details-page-tabs',
    name: 'Vulnerabilities',
    component: props => <CVEsHostDetailsTabWrapper {...props} />,
    weight: 300,
    metadata: {
      hideTab: vulnerabilityDisabled,
      title: __('Vulnerabilities'),
    },
  },
  {
    slot: 'host-details-page-tabs',
    name: 'Compliance',
    component: props => <ComplianceHostDetailsTabWrapper {...props} />,
    weight: 350,
    metadata: {
      hideTab: props => isNotRhelHost(props) || hasNoInsightsFacet(props),
      title: __('Compliance'),
    },
  },
];

export const registerFills = () => {
  fills.forEach(
    ({ slot, name, component: Component, weight, metadata }, index) =>
      addGlobalFill(
        slot,
        name,
        <Component key={`rh-cloud-fill-${index}`} />,
        weight,
        metadata
      )
  );
};
