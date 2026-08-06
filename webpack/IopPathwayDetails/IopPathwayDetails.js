import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';

import RemediationModal from '../InsightsCloudSync/Components/RemediationModal';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';

const scope = 'advisor';
const pathwayModule = './PathwayDetailsWrapped';

const IopPathwayDetails = props => {
  const pathwayMatch = useRouteMatch(
    '/foreman_rh_cloud/recommendations/pathways/:slug'
  );
  const slug = pathwayMatch?.params?.slug;

  return (
    <div className="iop-pathway-details-scalprum advisor">
      <ScalprumComponent
        scope={scope}
        module={pathwayModule}
        pathwayId={slug}
        IopRemediationModal={RemediationModal}
        {...props}
      />
    </div>
  );
};

const IopPathwayDetailsWrapped = props => {
  const permissions = useInsightsPermissions();
  return (
    <ScalprumProvider {...createProviderOptions(permissions)}>
      <IopPathwayDetails {...props} />
    </ScalprumProvider>
  );
};

export default IopPathwayDetailsWrapped;
