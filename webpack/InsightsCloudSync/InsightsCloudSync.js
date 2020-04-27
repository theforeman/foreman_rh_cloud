import React from 'react';
import { IntlProvider } from 'react-intl';
import { translate as __ } from 'foremanReact/common/I18n';
import { Button } from 'patternfly-react';
import { syncInsights } from './InsightsCloudSyncActions';

const InsightsCloudSync = () => (
  <IntlProvider locale={navigator.language}>
    <div className="insights-cloud-sync">
      <h1>{__('Red Hat Insights Sync')}</h1>
      <Button bsStyle="primary" onClick={syncInsights()}>
        {__('Sync now')}
      </Button>
    </div>
  </IntlProvider>
);

export default InsightsCloudSync;
