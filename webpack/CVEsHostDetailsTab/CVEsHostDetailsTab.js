import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { ScalprumComponent } from '@scalprum/react-core';
import { ScalprumContextWrapper } from '../common/ScalprumModule/ScalprumContext';

const CVEsHostDetailsTab = () => {
  const scope = 'vulnerability';
  const module = './SystemDetailTable';
  return (
    <div className="rh-cloud-insights-vulnerability-page">
      <ScalprumComponent scope={scope} module={module} />

      <PageLayout searchable={false} header={__('Vulnerability')}>
        <div className="insights-vulnerability">
          <p>
            This page is under development. Please check back soon for updates.
          </p>
        </div>
      </PageLayout>
    </div>
  );
};

const CVEsHostDetailsTabWrapper = () => (
  <ScalprumContextWrapper>
    <CVEsHostDetailsTab />
  </ScalprumContextWrapper>
);

export default CVEsHostDetailsTabWrapper;
