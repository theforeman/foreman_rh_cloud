import React from 'react';
import { foremanUrl } from '../../../../../../ForemanRhCloudHelpers';

const Toast = ({ syncHosts, disconnectHosts }) => {
  const totalHosts = syncHosts + disconnectHosts;
  return (
    <span>
      <p>
        From <strong>{totalHosts} host</strong>(s) with subscriprion
      </p>
      <p>
        <strong>{syncHosts} host</strong>(s) were uploaded successfully to the
        cloud
      </p>
      <p>
        <strong>{disconnectHosts} host</strong>(s) are not in sync.
      </p>
      <p>
        For more info, please visit the{' '}
        <a
          href={foremanUrl('/hosts')}
          target="_blank"
          rel="noopener noreferrer"
        >
          hosts page
        </a>
      </p>
    </span>
  );
};

export default Toast;
