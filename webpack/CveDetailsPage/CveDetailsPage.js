import React from 'react';
import { useParams } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { providerOptions } from '../common/ScalprumModule/ScalprumContext';

const CveDetailsPage = () => {
  const { cveId } = useParams();
  const scope = 'vulnerability';
  const module = './CveDetailPage';

  return (
    <ScalprumProvider {...providerOptions}>
      <div className="rh-cloud-cve-details-page">
        <ScalprumComponent scope={scope} module={module} cveId={cveId} />
      </div>
    </ScalprumProvider>
  );
};

export default CveDetailsPage;
