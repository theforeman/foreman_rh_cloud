import { getIopIframeSrc } from '../common/IopIframe/iopIframeHelpers';
import { ADVISOR_ROUTE_PREFIX, ADVISOR_STATIC_APP_PATH } from './advisorIframeConstants';

export const getAdvisorAppRoute = (path = '') => {
  const [pathname, search] = path.split('?');
  const query = search ? `?${search}` : '';
  if (pathname === '/foreman_rh_cloud/insights_cloud') return `recommendations${query}`;
  if (pathname === '/foreman_rh_cloud/recommendations' || pathname.startsWith('/foreman_rh_cloud/recommendations/')) {
    return `${pathname.slice('/foreman_rh_cloud/'.length)}${query}`;
  }
  if (pathname === ADVISOR_ROUTE_PREFIX) return `recommendations${query}`;
  if (pathname.startsWith(`${ADVISOR_ROUTE_PREFIX}/`)) return `${pathname.slice(ADVISOR_ROUTE_PREFIX.length + 1)}${query}`;
  return 'recommendations';
};

export const getAdvisorForemanPath = (route = 'recommendations') => {
  const normalized = String(route).replace(/^\/+/, '');
  // Only application-relative supported pages may update the outer URL.
  if (!/^(recommendations|systems)(\/[^?#]*)?(\?[^#]*)?$/.test(normalized) || normalized.split(/[/?]/).includes('..')) {
    return `${ADVISOR_ROUTE_PREFIX}/recommendations`;
  }
  return `${ADVISOR_ROUTE_PREFIX}/${normalized}`;
};

export const getAdvisorIframeSrc = () => getIopIframeSrc(ADVISOR_STATIC_APP_PATH);
