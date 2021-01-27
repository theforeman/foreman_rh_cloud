import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';

import {
  CONFIGURE_CLOUD_CONNECTOR,
  CONNECTOR_STATUS,
} from './CloudConnectorConstants';

export const selectStatus = state =>
  selectAPIResponse(state, CONFIGURE_CLOUD_CONNECTOR).task_status ||
  CONNECTOR_STATUS.NOT_RESOLVED;

export const selectJobLink = state =>
  selectAPIResponse(state, CONFIGURE_CLOUD_CONNECTOR).job_link;
