import React from 'react';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { translate as __ } from 'foremanReact/common/I18n';

const InsightsVulnerabilities = () => (
  <PageLayout searchable={false} header={__('Vulnerabilities')}>
    <div className="insights-vulnerabilities">
      <p>This page is under development. Please check back soon for updates.</p>
    </div>
  </PageLayout>
);

export default InsightsVulnerabilities;
