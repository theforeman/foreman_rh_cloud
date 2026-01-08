import React from 'react';
import { useParams } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';

const CveDetailsPage = () => {
  const { cveId } = useParams();
  const permissions = useInsightsPermissions();
  const scope = 'vulnerability';
  const module = './CveDetailPage';

  return (
    <ScalprumProvider {...createProviderOptions(permissions)}>
      <div className="rh-cloud-cve-details-page vulnerability">
        <ScalprumComponent scope={scope} module={module} cveId={cveId} />
      </div>
    </ScalprumProvider>
  );
};

export default CveDetailsPage;
