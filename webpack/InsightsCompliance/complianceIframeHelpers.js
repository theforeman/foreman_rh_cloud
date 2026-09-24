import {
  COMPLIANCE_ROUTE_PREFIX,
  COMPLIANCE_STATIC_APP_PATH,
} from './complianceIframeConstants';
import {
  getIopAppRoute,
  getIopForemanPath,
  getIopIframeSrc,
} from '../common/IopIframe/iopIframeHelpers';

const COMPLIANCE_IOP_PATH = {
  routePrefix: COMPLIANCE_ROUTE_PREFIX,
  fallbackRoute: 'reports',
};

export const getComplianceForemanPath = (appRoute = 'reports') =>
  getIopForemanPath(appRoute, COMPLIANCE_IOP_PATH);

export const getComplianceAppRoute = (pathname = '') =>
  getIopAppRoute(pathname, COMPLIANCE_IOP_PATH);

export const getComplianceIframeSrc = () =>
  getIopIframeSrc(COMPLIANCE_STATIC_APP_PATH);
