import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../../../../../ForemanRhCloudHelpers';

const Toast = ({ syncHosts, disconnectHosts, userOmittedHosts }) => {
  const totalHosts = syncHosts + disconnectHosts + userOmittedHosts;
  return (
    <span>
      <p>
        {__('Registered hosts in organization: ')}
        <strong>{totalHosts}</strong>
      </p>
      <p>
        {__('Uploaded to inventory: ')}
        <strong>{syncHosts}</strong>
      </p>
      <p>
        {__('Disconnected hosts: ')}
        <strong>{disconnectHosts}</strong>
      </p>
      {userOmittedHosts &&
        <p>
          {__('Not uploaded because host_registration_insights_inventory parameter is set to false: ')}
          <strong>{userOmittedHosts}</strong>
        </p>
      }
      <p>
        {__('For more info, please visit the')}{' '}
        <a
          href={foremanUrl('new/hosts')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {__('hosts page')}
        </a>
      </p>
    </span>
  );
};

Toast.propTypes = {
  syncHosts: PropTypes.number.isRequired,
  disconnectHosts: PropTypes.number.isRequired,
};

export default Toast;
