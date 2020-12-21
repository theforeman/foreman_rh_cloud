import React from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Button, Icon } from 'patternfly-react';
import { INSIGHTS_SYNC_PAGE_TITLE } from './InsightsCloudSyncConstants';
import InsightsSettings from './Components/InsightsSettings';
import { cloudTokenSettingUrl } from './InsightsCloudSyncHelpers';

const InsightsCloudSync = ({ syncInsights }) => {
  document.title = INSIGHTS_SYNC_PAGE_TITLE;
  return (
    <IntlProvider locale={navigator.language}>
      <div className="insights-cloud-sync">
        <h1>{__('Red Hat Insights Sync')}</h1>
        <div className="insights-cloud-sync-body">
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
              {__('Red Hat Cloud token ')}
              <Icon name="external-link" />
            </a>
            <br />
            {__(
              '3. Now you can synchronize recommendations manually using the "Sync now" button.'
            )}
          </p>
          <div>
            <Button bsStyle="primary" onClick={syncInsights}>
              {__('Sync now')}
            </Button>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
};

InsightsCloudSync.propTypes = {
  syncInsights: PropTypes.func.isRequired,
};

export default InsightsCloudSync;
