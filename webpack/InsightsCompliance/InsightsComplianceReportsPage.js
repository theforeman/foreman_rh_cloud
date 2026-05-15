import React from 'react';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { publishIopChromeBridge } from '../common/ScalprumModule/publishIopChromeBridge';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';

const InsightsComplianceReportsPage = () => {
  const scope = 'compliance';
  const module = './IopComplianceMount';

  return (
    <div className="rh-cloud-insights-compliance-page compliance">
      <ScalprumComponent scope={scope} module={module} />
    </div>
  );
};

const InsightsComplianceReportsPageWrap = () => {
  const permissions = useInsightsPermissions();
  const providerOptions = createProviderOptions(permissions);

  publishIopChromeBridge(providerOptions);

  return (
    <ScalprumProvider {...providerOptions}>
      <InsightsComplianceReportsPage />
    </ScalprumProvider>
  );
};

export default InsightsComplianceReportsPageWrap;
