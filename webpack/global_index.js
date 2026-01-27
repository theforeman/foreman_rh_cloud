import { registerColumns } from 'foremanReact/components/HostsIndex/Columns/core';
import { registerGetActions } from 'foremanReact/components/HostsIndex/TableRowActions/core';
import { registerReducers } from './ForemanRhCloudReducers';
import { registerFills } from './ForemanRhCloudFills';
import { registerRoutes } from './ForemanRhCloudPages';
import hostsIndexColumnExtensions from './ForemanColumnExtensions/index';
import getVulnerabilityAnalysisActions from './HostsIndexExtensions/VulnerabilityAnalysisActions';

registerReducers();
registerFills();
registerRoutes();
registerColumns(hostsIndexColumnExtensions);
registerGetActions({
  pluginName: 'foreman_rh_cloud',
  getActionsFunc: getVulnerabilityAnalysisActions,
  tableName: 'hosts',
});
