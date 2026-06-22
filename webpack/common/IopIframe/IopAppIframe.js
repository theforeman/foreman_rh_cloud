import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { useInsightsPermissions } from '../Hooks/PermissionsHooks';
import { useIopIframeChrome } from './useIopIframeChrome';
import { useIopIframeNavigate } from './useIopIframeNavigate';

/**
 * Full-page IoP app iframe: chrome sync + Foreman URL updates from NAVIGATE.
 * App shells supply src, route mappers, and message types.
 */
const IopAppIframe = ({
  appName,
  iframeSrc,
  getAppRoute,
  getForemanPath,
  defaultAppRoute,
  readyMessageType,
  navigateMessageType,
  className = '',
  testId = 'iop-app-iframe',
}) => {
  const iframeRef = useRef(null);
  const history = useHistory();
  const { pathname } = useLocation();
  const permissions = useInsightsPermissions();
  const appRoute = getAppRoute(pathname);

  const sendChromeContext = useIopIframeChrome({
    iframeRef,
    permissions,
    appRoute,
    pathname,
    readyMessageType,
  });

  useIopIframeNavigate({
    history,
    pathname,
    navigateMessageType,
    getForemanPath,
    defaultAppRoute,
  });

  return (
    <iframe
      ref={iframeRef}
      className={className}
      data-testid={testId}
      src={iframeSrc}
      aria-label={appName}
      onLoad={sendChromeContext}
    />
  );
};

IopAppIframe.propTypes = {
  appName: PropTypes.string.isRequired,
  iframeSrc: PropTypes.string.isRequired,
  getAppRoute: PropTypes.func.isRequired,
  getForemanPath: PropTypes.func.isRequired,
  defaultAppRoute: PropTypes.string.isRequired,
  readyMessageType: PropTypes.string.isRequired,
  navigateMessageType: PropTypes.string.isRequired,
  className: PropTypes.string,
  testId: PropTypes.string,
};

export default IopAppIframe;
