import { post } from 'foremanReact/redux/API';
import { CONFIGURE_CLOUD_CONNECTOR } from './CloudConnectorConstants';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';

export const configureCloudConnector = () =>
  post({
    key: CONFIGURE_CLOUD_CONNECTOR,
    url: inventoryUrl('enable_cloud_connector'),
  });
