import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';

export const PageDescription = () => (
  <div id="inventory_page_description">
    <p>
      {__(
        'Red Hat Insights is a set of cloud services which provide unified subscription reporting, predictive analysis and remediation of issues through this Satellite instance.'
      )}
    </p>
    <p>
      {__(
        'In order to utilize these servies, you can set the auto upload in the settings to "ON".'
      )}
    </p>
    <p>
      {__(
        'You can also trigger the upload manually by openning the relevant organization card, and clicking on the "Restart" button'
      )}
    </p>
  </div>
);

export default PageDescription;
