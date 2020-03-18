import { adjustTableWithInsights } from './InsightsExtension/Components/HostIndexPage';
import './ForemanInventoryUpload/foremanInventoryUpload.scss';

window.addEventListener('DOMContentLoaded', event => {
  switch (window.location.pathname) {
    case '/hosts':
      return adjustTableWithInsights();
    default:
      break;
  }
});
