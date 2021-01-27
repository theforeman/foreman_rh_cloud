import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CloudConnectorButton } from './CloudConnectorButton';
import { configureCloudConnector } from './CloudConnectorActions';
import { selectStatus, selectJobLink } from './CloudConnectorSelectors';

const ConnectedCloudConnectorButton = () => {
  const status = useSelector(selectStatus);
  const jobLink = useSelector(selectJobLink);
  const dispatch = useDispatch();
  return (
    <CloudConnectorButton
      status={status}
      onClick={() => dispatch(configureCloudConnector())}
      jobLink={jobLink}
    />
  );
};

export default ConnectedCloudConnectorButton;
