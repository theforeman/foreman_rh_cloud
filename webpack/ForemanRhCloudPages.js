import React from 'react';
import componentRegistry from 'foremanReact/components/componentRegistry';
import { registerRoutes as foremanRegisterRoutes } from 'foremanReact/routes/RoutingService';
import ForemanInventoryUpload from './ForemanInventoryUpload';
import InsightsVulnerabilityListPage from './InsightsVulnerability/InsightsVulnerabilityListPage';
import InsightsCloudSync from './InsightsCloudSync';
import IopRecommendationDetails from './IopRecommendationDetails/IopRecommendationDetails';
import InsightsHostDetailsTab from './InsightsHostDetailsTab';
import CveDetailsPage from './CveDetailsPage';
import InsightsCompliancePage from './InsightsCompliance/InsightsCompliancePage';
import InsightsVulnerabilityIframePage from './InsightsVulnerability/InsightsVulnerabilityIframePage';
import './common/styles.scss';
import InsightsAdvisorIframePage from './InsightsAdvisor/InsightsAdvisorIframePage';

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
  { name: 'InsightsCompliancePage', type: InsightsCompliancePage },
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
    path: '/foreman_rh_cloud/recommendations/pathways/:slug',
    exact: false,
    render: props => <InsightsAdvisorIframePage {...props} />,
  },
  {
    path: '/foreman_rh_cloud/recommendations',
    exact: false,
    render: props => <InsightsAdvisorIframePage {...props} />,
  },
  {
    path: '/foreman_rh_cloud/inventory_upload',
    exact: true,
    render: props => <ForemanInventoryUpload {...props} />,
  },
  {
    path: '/foreman_rh_cloud/insights_advisor',
    exact: false,
    render: props => <InsightsAdvisorIframePage {...props} />,
  },
  {
    path: '/foreman_rh_cloud/insights_vulnerability',
    exact: false,
    render: props => <InsightsVulnerabilityIframePage {...props} />,
  },
  {
    path: '/foreman_rh_cloud/insights_compliance',
    exact: false,
    render: props => <InsightsCompliancePage {...props} />,
  },
];

export const registerRoutes = () => {
  foremanRegisterRoutes('foreman_rh_cloud', routes);
};
