import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import InventoryAutoUploadSwitcher from './ForemanInventoryUpload/SubscriptionsPageExtension/InventoryAutoUpload';
import NewHostDetailsTab from './InsightsHostDetailsTab/NewHostDetailsTab';
import { InsightsTotalRiskChartWrapper } from './InsightsHostDetailsTab/InsightsTotalRiskChartWrapper';
import { isNotRhelHost, vulnerabilityDisabled } from './ForemanRhCloudHelpers';
import CVEsHostDetailsTab from './CVEsHostDetailsTab/CVEsHostDetailsTab';

const fills = [
  {
    slot: 'katello-manage-manifest-form',
    name: 'InventoryAutoUpload',
    component: () => <InventoryAutoUploadSwitcher />,
    weight: 50,
  },
  {
    slot: 'host-details-page-tabs',
    name: 'Insights',
    component: props => <NewHostDetailsTab {...props} />,
    weight: 400,
    metadata: {
      hideTab: isNotRhelHost,
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
    name: 'CVEs',
    component: props => <CVEsHostDetailsTab {...props} />,
    weight: 300,
    metadata: {
      hideTab: vulnerabilityDisabled,
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
