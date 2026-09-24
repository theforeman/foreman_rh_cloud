import { useEffect } from 'react';
import { IOP_IFRAME_HEIGHT } from './iopIframeConstants';

/**
 * Sizes a host-details iframe from IOP_IFRAME_HEIGHT messages sent by the child.
 *
 * @param {Object} options
 * @param {React.RefObject} options.iframeRef
 */
export const useIopIframeHeight = ({ iframeRef }) => {
  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== IOP_IFRAME_HEIGHT) {
        return;
      }

      const iframe = iframeRef.current;
      const height = event.data.payload?.height;

      if (!iframe || !height) {
        return;
      }

      iframe.style.height = `${height}px`;
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [iframeRef]);
};
