import { useEffect, useRef } from 'react';

/**
 * Listens for iframe NAVIGATE messages and pushes matching Foreman paths.
 *
 * @param {Object} options
 * @param {Object} options.history react-router v5 history
 * @param {string} options.pathname current Foreman pathname
 * @param {string} options.navigateMessageType
 * @param {(appRoute: string) => string} options.getForemanPath
 * @param {string} options.defaultAppRoute fallback when payload.appRoute is missing
 */
export const useIopIframeNavigate = ({
  history,
  pathname,
  navigateMessageType,
  getForemanPath,
  defaultAppRoute,
}) => {
  const lastPostedAppRouteRef = useRef(null);

  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== navigateMessageType) {
        return;
      }

      const appRoute = event.data.payload?.appRoute || defaultAppRoute;

      if (appRoute === lastPostedAppRouteRef.current) {
        return;
      }

      const nextPath = getForemanPath(appRoute);

      if (pathname !== nextPath) {
        lastPostedAppRouteRef.current = appRoute;
        history.push(nextPath);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [
    defaultAppRoute,
    getForemanPath,
    history,
    navigateMessageType,
    pathname,
  ]);
};
