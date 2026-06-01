import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';

import RemediationModal from '../InsightsCloudSync/Components/RemediationModal';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';

const scope = 'advisor';
const module = './RecommendationDetailsWrapped';
const pathwayModule = './PathwayDetailsWrapped';

const IopRecommendationDetails = props => {
  const pathwayMatch = useRouteMatch(
    '/foreman_rh_cloud/recommendations/pathways/:slug'
  );
  const urlParams = useRouteMatch('/foreman_rh_cloud/recommendations/:rule_id');
  // eslint-disable-next-line camelcase
  const ruleId = urlParams?.params?.rule_id;

  if (pathwayMatch) {
    return (
      <div className="iop-pathway-details-scalprum advisor">
        <ScalprumComponent
          scope={scope}
          module={pathwayModule}
          pathwayId={pathwayMatch.params.slug}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className="iop-recommendation-details-scalprum advisor">
      <ScalprumComponent
        scope={scope}
        module={module}
        IopRemediationModal={RemediationModal}
        ruleId={ruleId}
        {...props}
      />
    </div>
  );
};

const IopRecommendationDetailsWrapped = props => {
  const permissions = useInsightsPermissions();
  return (
    <ScalprumProvider {...createProviderOptions(permissions)}>
      <IopRecommendationDetails {...props} />
    </ScalprumProvider>
  );
};

export default IopRecommendationDetailsWrapped;
