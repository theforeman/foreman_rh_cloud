import React from 'react';
import { Text } from '@patternfly/react-core';
import { useSelector } from 'react-redux';

import { translate as __ } from 'foremanReact/common/I18n';
import { getDocsURL } from 'foremanReact/common/helpers';
import { FormattedMessage } from 'react-intl';
import { selectSubscriptionConnectionEnabled } from '../../../InventorySettings/InventorySettingsSelectors';

export const PageDescription = () => {
  const subscriptionConnectionEnabled = useSelector(
    selectSubscriptionConnectionEnabled
  );

  return (
    <div id="inventory_page_description">
      <Text ouiaId="text-cloud-console">
        {__(
          'The Red Hat Hybrid Cloud Console provides a set of cloud services, including Red Hat Insights and Subscriptions, that provide predictive analysis, remediation of issues, and unified subscription reporting for this Foreman instance.'
        )}
      </Text>
      <Text ouiaId="text-inventory-upload">
        {__(
          'The Foreman inventory upload plugin automatically uploads Foreman host inventory data to the Inventory service of Insights, where it can also be used by the Subscriptions service for subscription reporting. If you use the Subscriptions service, enabling inventory uploads is required.'
        )}
      </Text>
      {subscriptionConnectionEnabled && (
        <Text ouiaId="text-enable-report">
          <FormattedMessage
            id="enable-upload-hint"
            defaultMessage={__(
              'To enable this reporting for all Foreman organizations, set {uploadButtonName} to on. The data will be reported automatically once per day.'
            )}
            values={{
              uploadButtonName: (
                <strong>{__('Automatic inventory upload')}</strong>
              ),
            }}
          />
        </Text>
      )}
      {subscriptionConnectionEnabled && (
        <Text ouiaId="text-restart-button">
          <FormattedMessage
            id="restart-button-hint"
            defaultMessage={__(
              'To manually upload the data for a specific organization, select an organization and click {restartButtonName}.'
            )}
            values={{
              restartButtonName: (
                <strong>{__('Generate and upload report')}</strong>
              ),
            }}
          />
        </Text>
      )}
      <Text ouiaId="text-minimal-data-collection">
        {__('Learn more about ')}
        <a
          href={getDocsURL('Managing_Hosts', 'setting-minimal-data-collection')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {__('Minimal data collection setting')}
        </a>
      </Text>
      <Text ouiaId="text-more-info-subscription">
        {__('For more information about the Subscriptions service, see:')}
        &nbsp;
        <a
          href="https://docs.redhat.com/en/documentation/subscription_central/1-latest/html/getting_started_with_the_subscriptions_service/index"
          target="_blank"
          rel="noopener noreferrer"
        >
          {__('About subscription watch')}
        </a>
      </Text>
      <Text ouiaId="text-more-info-insights">
        {__('For more information about Insights and Cloud Connector, see:')}
        &nbsp;
        <a
          href="https://console.redhat.com/security/insights/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {__('Red Hat Insights Data and Application Security')}
        </a>
      </Text>
    </div>
  );
};

export default PageDescription;
