import { mockUser } from '../ScalprumModule/ScalprumContext';
import { IOP_CHROME_INIT } from './iopIframeConstants';

/**
 * Sends chrome/RBAC context into an IoP app iframe after it loads.
 *
 * @param {HTMLIFrameElement} iframe
 * @param {Object} options
 * @param {Array} options.permissions Insights-format permissions from useInsightsPermissions
 * @param {string} options.appRoute Path inside the iframe application page (e.g. reports, systems/<uuid>)
 * @param {string} [options.pathname] Foreman pathname (informational; passed through to the child)
 * @param {string} [options.embedded] Embedding mode for the iframe (e.g. 'host-tab')
 */
export const postIopChromeToIframe = (
  iframe,
  { permissions = [], pathname = '', appRoute = '', embedded } = {}
) => {
  if (!iframe?.contentWindow || typeof window === 'undefined') {
    return;
  }

  iframe.contentWindow.postMessage(
    {
      type: IOP_CHROME_INIT,
      payload: {
        user: mockUser,
        permissions,
        appRoute,
        pathname,
        ...(embedded ? { embedded } : {}),
      },
    },
    window.location.origin
  );
};
