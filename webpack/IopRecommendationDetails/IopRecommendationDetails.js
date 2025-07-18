import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';

import RemediationModal from '../InsightsCloudSync/Components/RemediationModal';
import { providerOptions } from '../common/ScalprumModule/ScalprumContext';

const scope = 'advisor';
const module = './RecommendationDetailsWrapped';

const invScope = 'inventory';
const invModule = './HybridInventoryTabs';

const IopRecommendationDetails = props => {
  const urlParams = useRouteMatch('/foreman_rh_cloud/recommendations/:rule_id');
  // eslint-disable-next-line camelcase
  const ruleId = urlParams?.params?.rule_id;
  return (
    <div className="rh-cloud-recommendation-details-cell">
      <ScalprumComponent
        scope={scope}
        module={module}
        IopRemediationModal={RemediationModal}
        ruleId={ruleId}
        {...props}
      />
      <ScalprumComponent
        scope={invScope}
        module={invModule}
        IopRemediationModal={RemediationModal}
        ruleId={ruleId}
        {...props}
      />
    </div>
  );
};

const IopRecommendationDetailsWrapped = props => (
  <ScalprumProvider {...providerOptions}>
    <IopRecommendationDetails {...props} />
  </ScalprumProvider>
);

export default IopRecommendationDetailsWrapped;
