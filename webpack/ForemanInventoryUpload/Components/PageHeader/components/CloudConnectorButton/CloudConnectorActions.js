import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { get, post } from 'foremanReact/redux/API';
import { CONFIGURE_CLOUD_CONNECTOR } from './CloudConnectorConstants';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';
import { foremanUrl } from '../../../../../ForemanRhCloudHelpers';

export const configureCloudConnector = () =>
  post({
    key: CONFIGURE_CLOUD_CONNECTOR,
    url: inventoryUrl('cloud_connector'),
    successToast: response => (
      <span>
        {__('Cloud connector setup is in progress now: ')}
        <a href={foremanUrl(`/job_invocations/${response.data.id}`)}>
          {__('Cloud connector job link')}
        </a>
      </span>
    ),
    errorToast: error => `${__('Cloud connector setup has failed: ')} ${error}`,
  });

export const getCloudConnector = () =>
  get({
    key: CONFIGURE_CLOUD_CONNECTOR,
    url: inventoryUrl('cloud_connector'),
  });
