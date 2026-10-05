import { useCallback, useEffect } from 'react';
import { postIopChromeToIframe } from './postIopChromeToIframe';

/**
 * Posts IOP chrome context into an iframe and re-posts when the child signals READY.
 *
 * @param {Object} options
 * @param {React.RefObject} options.iframeRef
 * @param {Array} options.permissions
 * @param {string} options.appRoute
 * @param {string} [options.pathname]
 * @param {string} [options.embedded]
 * @param {string} options.readyMessageType postMessage type from the child (e.g. IOP_COMPLIANCE_READY)
 * @returns {Function} sendChromeContext — also pass to iframe onLoad
 */
export const useIopIframeChrome = ({
  iframeRef,
  permissions,
  appRoute,
  pathname = '',
  embedded,
  readyMessageType,
}) => {
  const sendChromeContext = useCallback(() => {
    postIopChromeToIframe(iframeRef.current, {
      permissions,
      appRoute,
      pathname,
      embedded,
    });
  }, [appRoute, embedded, iframeRef, pathname, permissions]);

  useEffect(() => {
    sendChromeContext();
  }, [sendChromeContext]);

  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === readyMessageType) {
        sendChromeContext();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [readyMessageType, sendChromeContext]);

  return sendChromeContext;
};
