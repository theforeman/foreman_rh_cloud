import React from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Button, noop } from 'patternfly-react';

const InsightsCloudSync = ({ syncInsights }) => (
  <IntlProvider locale={navigator.language}>
    <div className="insights-cloud-sync">
      <h1>{__('Red Hat Insights Sync')}</h1>
      <Button bsStyle="primary" onClick={syncInsights}>
        {__('Sync now')}
      </Button>
    </div>
  </IntlProvider>
);

InsightsCloudSync.propTypes = {
  syncInsights: PropTypes.func,
};

InsightsCloudSync.defaultProps = {
  syncInsights: noop,
};

export default InsightsCloudSync;
