/* eslint-disable spellcheck/spell-checker */
import React from 'react';
import componentRegistry from 'foremanReact/components/componentRegistry';
import { registerRoutes as foremanRegisterRoutes } from 'foremanReact/routes/RoutingService';
import ForemanInventoryUpload from './ForemanInventoryUpload';
import InsightsVulnerabilityListPage from './InsightsVulnerability/InsightsVulnerabilityListPage';
import InsightsCloudSync from './InsightsCloudSync';
import IopRecommendationDetails from './IopRecommendationDetails/IopRecommendationDetails';
import InsightsHostDetailsTab from './InsightsHostDetailsTab';
import CveDetailsPage from './CveDetailsPage';

const pages = [
  { name: 'ForemanInventoryUpload', type: ForemanInventoryUpload },
  { name: 'InsightsCloudSync', type: InsightsCloudSync },
  { name: 'IopRecommendationDetails', type: IopRecommendationDetails },
  { name: 'InsightsHostDetailsTab', type: InsightsHostDetailsTab },
  {
    name: 'InsightsVulnerabilityListPage',
    type: InsightsVulnerabilityListPage,
  },
  { name: 'CveDetailsPage', type: CveDetailsPage },
];

export const registerPages = () => {
  pages.forEach(page => componentRegistry.register(page));
};

export const routes = [
  {
    path: '/foreman_rh_cloud/insights_cloud',
    exact: true,
    render: props => <InsightsCloudSync {...props} />,
  },
  {
    path: '/foreman_rh_cloud/recommendations',
    exact: false,
    render: props => <IopRecommendationDetails {...props} />,
  },
  {
    path: '/foreman_rh_cloud/inventory_upload',
    exact: true,
    render: props => <ForemanInventoryUpload {...props} />,
  },
  {
    path: '/foreman_rh_cloud/insights_vulnerability',
    exact: true,
    render: props => <InsightsVulnerabilityListPage {...props} />,
  },
  {
    path: '/foreman_rh_cloud/insights_vulnerability/:cveId',
    exact: true,
    render: props => <CveDetailsPage {...props} />,
  },
];

export const registerRoutes = () => {
  foremanRegisterRoutes('foreman_rh_cloud', routes);
};
