import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../../../../ForemanRhCloudHelpers';


const statusSearchParams = statusName => `/new/hosts?search=insights_inventory_sync_status+%3D+${statusName}&page=1`;
const DISCONNECT = 'disconnect';
const SYNC = 'sync';
const USER_OMITTED = 'user_omitted';
const HostsWithStatusLink = ({ statusName, children }) => (
  <Link to={statusSearchParams(statusName)}>{children}</Link>
);

const Toast = ({ syncHosts, disconnectHosts, userOmittedHosts }) => {
  const totalHosts = syncHosts + disconnectHosts + userOmittedHosts;
  return (
    <span>
      <p>
        {__('Registered hosts in organization: ')}
        <Link to='/new/hosts?search=set%3F+subscription_uuid&page=1'>
          {totalHosts}
        </Link>
      </p>
      <p>
        {__('Uploaded and present on console.redhat.com Inventory service: ')}
        <HostsWithStatusLink statusName={SYNC}>
          {syncHosts}
        </HostsWithStatusLink>
      </p>
      <p>
        {__('Not present on console.redhat.com Inventory service: ')}
        <HostsWithStatusLink statusName={DISCONNECT}>
          {disconnectHosts}
        </HostsWithStatusLink>
      </p>
      {userOmittedHosts &&
        <p>
          {__('Excluded from upload to console.redhat.com Inventory service because \
            host_registration_insights_inventory parameter value is false: ')}
          <HostsWithStatusLink statusName={USER_OMITTED}>
            {userOmittedHosts}
          </HostsWithStatusLink>
        </p>
      }
      <p>
        {__('You can review this information later by looking at the Inventory status of each host.')}
      </p>
    </span>
  );
};

Toast.propTypes = {
  syncHosts: PropTypes.number.isRequired,
  disconnectHosts: PropTypes.number.isRequired,
  userOmittedHosts: PropTypes.number,
};
Toast.defaultProps = {
  userOmittedHosts: 0,
};

export default Toast;
