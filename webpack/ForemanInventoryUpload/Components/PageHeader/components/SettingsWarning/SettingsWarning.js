import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const SettingsWarning = ({
  autoUpload,
  hostObfuscation,
  isCloudConnector,
}) => {
  const [showUploadWarning, setShowUploadWarning] = useState(true);
  const [showObfuscationWarning, setShowObfuscationWarning] = useState(true);
  if (!isCloudConnector || (!showUploadWarning && !showObfuscationWarning)) {
    return null;
  }
  if (autoUpload && !hostObfuscation) {
    return null;
  }

  const alerts = [];
  if (!autoUpload && showUploadWarning) {
    alerts.push(
      <Alert
        key="auto-upload"
        variant="warning"
        title={__(
          "Cloud Connector has been configured however the inventory auto-upload is disabled, it's recommended to enable it"
        )}
        actionClose={
          <AlertActionCloseButton onClose={() => setShowUploadWarning(false)} />
        }
      />
    );
  }
  if (hostObfuscation && showObfuscationWarning) {
    alerts.push(
      <Alert
        key="obfuscating-host"
        variant="warning"
        title={__(
          "Cloud Connector has been configured however obfuscating host names setting is enabled, it's recommended to disable it"
        )}
        actionClose={
          <AlertActionCloseButton
            onClose={() => setShowObfuscationWarning(false)}
          />
        }
      />
    );
  }
  return <div className="settings-alert">{alerts}</div>;
};

SettingsWarning.propTypes = {
  autoUpload: PropTypes.bool,
  hostObfuscation: PropTypes.bool,
  isCloudConnector: PropTypes.bool,
};

SettingsWarning.defaultProps = {
  autoUpload: false,
  hostObfuscation: false,
  isCloudConnector: false,
};
