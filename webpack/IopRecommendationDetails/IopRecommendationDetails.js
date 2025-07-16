import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ScalprumContextWrapper } from '../common/ScalprumModule/ScalprumContext';
import { RhCloudScalprumComponent } from '../common/ScalprumModule/RhCloudScalprumComponent';
import RemediationModal from '../InsightsCloudSync/Components/RemediationModal';

const scope = 'advisor';
const module = './RecommendationDetailsWrapped';
const path = `apps/${scope}`;
const manifestLocation = `/${path}/fed-mods.json`;

const IopRecommendationDetails = props => {
  const urlParams = useRouteMatch('/foreman_rh_cloud/recommendations/:rule_id');
  // eslint-disable-next-line camelcase
  const ruleId = urlParams?.params?.rule_id;
  return (
    <ScalprumContextWrapper>
      <RhCloudScalprumComponent
        scope={scope}
        module={module}
        path={path}
        manifestLocation={manifestLocation}
        IopRemediationModal={RemediationModal}
        ruleId={ruleId}
        {...props}
      />
    </ScalprumContextWrapper>
  );
};

export default IopRecommendationDetails;
