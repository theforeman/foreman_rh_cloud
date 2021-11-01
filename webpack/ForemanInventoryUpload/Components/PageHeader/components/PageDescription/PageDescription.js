import React from 'react';
import { Text } from '@patternfly/react-core';

import { translate as __ } from 'foremanReact/common/I18n';

export const PageDescription = () => (
  <div id="inventory_page_description">
    <Text>
      {__(
        'Red Hat Insights is a set of cloud services which provide unified subscription reporting, predictive analysis and remediation of issues through this Satellite instance.'
      )}
    </Text>
    <Text>
      {__(
        'You can toggle the Auto upload switch to the ON position to enable Satellite to automatically upload your host inventory once a day.'
      )}
    </Text>
    <Text>
      {__(
        'Click Restart to upload your host inventory to Red Hat Insights. Perform this step for each organization from which you want to manually upload a host inventory.'
      )}
    </Text>
    <Text>
      {__(
        'Enabling inventory uploads is required by subscription watch. For more information about subscription watch see link:'
      )}
      &nbsp;
      <a
        href="https://access.redhat.com/documentation/en-us/subscription_central/2020-04/html/getting_started_with_subscription_watch/assembly-about-subscriptionwatch"
        target="_blank"
        rel="noopener noreferrer"
      >
        {__('About subscription watch')}
      </a>
    </Text>
    <Text>
      {__('For more information about Insights and Cloud Connector read')}
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

export default PageDescription;
