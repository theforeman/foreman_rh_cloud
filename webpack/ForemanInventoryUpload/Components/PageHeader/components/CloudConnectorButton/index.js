import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openConfirmModal } from 'foremanReact/components/ConfirmModal';
import { translate as __ } from 'foremanReact/common/I18n';
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
      onClick={() =>
        dispatch(
          openConfirmModal({
            title: __('Notice'),
            message: __(
              'This action will also enable automatic reports upload'
            ),
            isWarning: true,
            onConfirm: () => dispatch(configureCloudConnector()),
          })
        )
      }
      jobLink={jobLink}
    />
  );
};

export default ConnectedCloudConnectorButton;
