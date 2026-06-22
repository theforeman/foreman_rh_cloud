import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useInsightsPermissions } from '../Hooks/PermissionsHooks';
import { useIopIframeChrome } from './useIopIframeChrome';
import './IopHostDetailsIframe.scss';

/**
 * Host-details tab iframe for an IoP app (chrome post + READY re-sync).
 * App-specific wrappers supply src, appRoute, title, and styles.
 */
const IopHostDetailsIframe = ({
  inventoryId,
  iframeSrc,
  appRoute,
  title,
  readyMessageType,
  className = '',
  iframeClassName = 'rh-cloud-iop-host-details-iframe',
  testId = 'iop-host-details-iframe',
}) => {
  const iframeRef = useRef(null);
  const permissions = useInsightsPermissions();
  const sendChromeContext = useIopIframeChrome({
    iframeRef,
    permissions,
    appRoute,
    embedded: 'host-tab',
    readyMessageType,
  });

  return (
    <div className={className}>
      <iframe
        key={inventoryId}
        ref={iframeRef}
        className={iframeClassName}
        data-testid={testId}
        src={iframeSrc}
        aria-label={title}
        onLoad={sendChromeContext}
      />
    </div>
  );
};

IopHostDetailsIframe.propTypes = {
  inventoryId: PropTypes.string.isRequired,
  iframeSrc: PropTypes.string.isRequired,
  appRoute: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  readyMessageType: PropTypes.string.isRequired,
  className: PropTypes.string,
  iframeClassName: PropTypes.string,
  testId: PropTypes.string,
};

export default IopHostDetailsIframe;
