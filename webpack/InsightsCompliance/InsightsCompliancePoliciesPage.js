import React from 'react';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { publishIopChromeBridge } from '../common/ScalprumModule/publishIopChromeBridge';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';

const InsightsCompliancePoliciesPage = () => {
  const scope = 'compliance';
  const module = './IopComplianceMount';

  return (
    <div className="rh-cloud-insights-compliance-page compliance">
      <ScalprumComponent scope={scope} module={module} />
    </div>
  );
};

const InsightsCompliancePoliciesPageWrap = () => {
  const permissions = useInsightsPermissions();
  const providerOptions = createProviderOptions(permissions);

  publishIopChromeBridge(providerOptions);

  return (
    <ScalprumProvider {...providerOptions}>
      <InsightsCompliancePoliciesPage />
    </ScalprumProvider>
  );
};

export default InsightsCompliancePoliciesPageWrap;
