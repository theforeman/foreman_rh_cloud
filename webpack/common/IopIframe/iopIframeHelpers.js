/**
 * Foreman browser path for an IoP app sub-route.
 *
 * @param {string} appRoute Path inside the iframe application page
 * @param {{ routePrefix: string, fallbackRoute: string }} options
 * @returns {string}
 */
export const getIopForemanPath = (
  appRoute = '',
  { routePrefix, fallbackRoute } = {}
) => {
  const subRoute = String(appRoute).replace(/^\/+/, '') || fallbackRoute;

  return `${routePrefix}/${subRoute}`;
};

/**
 * Path inside the iframe application page derived from a Foreman pathname.
 *
 * @param {string} pathname Foreman location pathname
 * @param {{ routePrefix: string, fallbackRoute: string }} options
 * @returns {string}
 */
export const getIopAppRoute = (
  pathname = '',
  { routePrefix, fallbackRoute } = {}
) => {
  if (!pathname.startsWith(routePrefix)) {
    return fallbackRoute;
  }

  const subRoute = pathname.slice(routePrefix.length).replace(/^\//, '');

  return subRoute || fallbackRoute;
};

/**
 * Absolute URL for a static IoP app entry under Satellite assets.
 *
 * @param {string} staticAppPath e.g. /assets/apps/compliance/index.html
 * @returns {string}
 */
export const getIopIframeSrc = staticAppPath => {
  if (typeof window === 'undefined') {
    return staticAppPath;
  }

  return `${window.location.origin}${staticAppPath}`;
};
