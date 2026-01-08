import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';

import RemediationModal from '../InsightsCloudSync/Components/RemediationModal';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';

const scope = 'advisor';
const module = './RecommendationDetailsWrapped';

const IopRecommendationDetails = props => {
  const urlParams = useRouteMatch('/foreman_rh_cloud/recommendations/:rule_id');
  // eslint-disable-next-line camelcase
  const ruleId = urlParams?.params?.rule_id;
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
