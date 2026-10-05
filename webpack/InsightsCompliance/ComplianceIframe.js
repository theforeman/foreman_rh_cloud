import React from 'react';
import PropTypes from 'prop-types';
import IopAppIframe from '../common/IopIframe/IopAppIframe';
import {
  getComplianceAppRoute,
  getComplianceForemanPath,
  getComplianceIframeSrc,
} from './complianceIframeHelpers';
import {
  IOP_COMPLIANCE_NAVIGATE,
  IOP_COMPLIANCE_READY,
} from './complianceIframeConstants';

import './ComplianceIframe.scss';

const ComplianceIframe = ({ appName }) => (
  <IopAppIframe
    appName={appName}
    iframeSrc={getComplianceIframeSrc()}
    getAppRoute={getComplianceAppRoute}
    getForemanPath={getComplianceForemanPath}
    defaultAppRoute="reports"
    readyMessageType={IOP_COMPLIANCE_READY}
    navigateMessageType={IOP_COMPLIANCE_NAVIGATE}
    className="rh-cloud-insights-compliance-iframe"
    testId="compliance-iframe"
  />
);

ComplianceIframe.propTypes = {
  appName: PropTypes.string.isRequired,
};

export default ComplianceIframe;
