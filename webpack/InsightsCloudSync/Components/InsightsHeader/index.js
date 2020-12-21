import React from 'react';
import { Icon } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import InsightsSettings from '../InsightsSettings';
import { cloudTokenSettingUrl } from '../../InsightsCloudSyncHelpers';

const InsightsHeader = () => (
  <div className="insights-header" style={{ marginBottom: '15px' }}>
    <InsightsSettings />
    <p>
      {__(`Insights synchronization process is used to provide Insights
             recommendations output for hosts managed here`)}
    </p>
    <p>
      {__(`1. Obtain an Red Hat API token: `)}
      <a
        href="https://access.redhat.com/management/api"
        target="_blank"
        rel="noopener noreferrer"
      >
        access.redhat.com <Icon name="external-link" />
      </a>
      <br />
      {__("2. Copy the token to 'Red Hat Cloud token' setting: ")}
      <a
        href={cloudTokenSettingUrl()}
        target="_blank"
        rel="noopener noreferrer"
      >
        {__('Red Hat Cloud token')} <Icon name="external-link" />
      </a>
      <br />
      {__(
        '3. Now you can synchronize recommendations manually using the "Sync now" button.'
      )}
    </p>
  </div>
);

export default InsightsHeader;
