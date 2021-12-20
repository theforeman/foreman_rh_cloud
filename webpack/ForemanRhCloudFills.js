import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import InventoryAutoUploadSwitcher from './ForemanInventoryUpload/SubscriptionsPageExtension/InventoryAutoUpload';
import NewHostDetailsTab from './InsightsHostDetailsTab/NewHostDetailsTab';
import InsightsTotalRiskCard from './InsightsHostDetailsTab/InsightsTotalRiskChart';

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
  },
  {
    slot: 'details-cards',
    name: 'insights-total-risk-chart',
    component: props => <InsightsTotalRiskCard {...props} />,
    weight: 1100,
  },
];

export const registerFills = () => {
  fills.forEach(({ slot, name, component: Component, weight }, index) =>
    addGlobalFill(
      slot,
      name,
      <Component key={`rh-cloud-fill-${index}`} />,
      weight
    )
  );
};
