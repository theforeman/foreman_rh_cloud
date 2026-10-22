import { useEffect } from 'react';

/**
 * Listens for iframe NAVIGATE messages and pushes matching Foreman paths.
 *
 * @param {Object} options
 * @param {Object} options.history react-router v5 history
 * @param {string} options.navigateMessageType
 * @param {(appRoute: string) => string} options.getForemanPath
 * @param {string} options.defaultAppRoute fallback when payload.appRoute is missing
 * @param {boolean} [options.replaceSearch] Replace query-only updates in page history
 */
export const useIopIframeNavigate = ({
  history,
  navigateMessageType,
  getForemanPath,
  defaultAppRoute,
  replaceSearch = false,
}) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== navigateMessageType) {
        return;
      }

      const appRoute = event.data.payload?.appRoute || defaultAppRoute;
      const nextPath = getForemanPath(appRoute);

      const currentPath = window.location.pathname;
      const currentUrl = `${currentPath}${replaceSearch ? window.location.search : ''}`;
      if (currentUrl !== nextPath) {
        if (
          replaceSearch &&
          new URL(nextPath, window.location.origin).pathname === currentPath
        ) {
          history.replace(nextPath);
        } else {
          history.push(nextPath);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [
    defaultAppRoute,
    getForemanPath,
    history,
    navigateMessageType,
    replaceSearch,
  ]);
};
