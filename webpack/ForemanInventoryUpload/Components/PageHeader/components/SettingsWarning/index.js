import React from 'react';
import { useSelector } from 'react-redux';
import { SettingsWarning } from './SettingsWarning';
import {
  selectAutoUploadEnabled,
  selectHostObfuscationEnabled,
} from '../../../AccountList/AccountListSelectors';
import { CONNECTOR_STATUS } from '../CloudConnectorButton/CloudConnectorConstants';
import { selectStatus } from '../CloudConnectorButton/CloudConnectorSelectors';

const ConnectedSettingsWarning = () => {
  const autoUpload = useSelector(selectAutoUploadEnabled);
  const hostObfuscation = useSelector(selectHostObfuscationEnabled);
  const isCloudConnector =
    useSelector(selectStatus) === CONNECTOR_STATUS.RESOLVED;
  return (
    <SettingsWarning
      autoUpload={autoUpload}
      hostObfuscation={hostObfuscation}
      isCloudConnector={isCloudConnector}
    />
  );
};

export default ConnectedSettingsWarning;
