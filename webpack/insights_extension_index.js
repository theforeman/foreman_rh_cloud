import { adjustTableWithInsights } from './InsightsExtension/HostIndexPage';

window.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  switch (path) {
    case '/hosts':
      return adjustTableWithInsights();
    default:
      break;
  }
});
