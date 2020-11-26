import componentRegistry from 'foremanReact/components/componentRegistry';
import ForemanInventoryUpload from './ForemanInventoryUpload';
import InsightsCloudSync from './InsightsCloudSync';
import InsightsHostDetailsTab from './InsightsHostDetailsTab';

const pages = [
  { name: 'ForemanInventoryUpload', type: ForemanInventoryUpload },
  { name: 'InsightsCloudSync', type: InsightsCloudSync },
  { name: 'InsightsHostDetailsTab', type: InsightsHostDetailsTab },
];

export const registerPages = () => {
  pages.forEach(page => componentRegistry.register(page));
};
