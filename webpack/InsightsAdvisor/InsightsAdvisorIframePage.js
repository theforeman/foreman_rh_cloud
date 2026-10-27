import React from 'react';
import IopAppIframe from '../common/IopIframe/IopAppIframe';
import { getAdvisorAppRoute, getAdvisorForemanPath, getAdvisorIframeSrc } from './advisorIframeHelpers';
import { IOP_ADVISOR_READY, IOP_ADVISOR_NAVIGATE } from './advisorIframeConstants';
import './AdvisorIframe.scss';

const InsightsAdvisorIframePage = () => (
  <div className="rh-cloud-insights-advisor-iframe-page">
    <IopAppIframe
      appName="Advisor"
      iframeSrc={getAdvisorIframeSrc()}
      getAppRoute={getAdvisorAppRoute}
      getForemanPath={getAdvisorForemanPath}
      defaultAppRoute="recommendations"
      readyMessageType={IOP_ADVISOR_READY}
      navigateMessageType={IOP_ADVISOR_NAVIGATE}
      className="rh-cloud-insights-advisor-iframe"
      testId="advisor-iframe"
      syncSearch
    />
  </div>
);
export default InsightsAdvisorIframePage;
