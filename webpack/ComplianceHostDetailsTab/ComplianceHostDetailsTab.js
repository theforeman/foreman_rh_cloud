import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import IopHostDetailsIframeTab from '../common/IopIframe/IopHostDetailsIframeTab';
import { getComplianceIframeSrc } from '../InsightsCompliance/complianceIframeHelpers';
import { IOP_COMPLIANCE_READY } from '../InsightsCompliance/complianceIframeConstants';
import './ComplianceHostDetailsTab.scss';

const ComplianceHostDetailsTabWrapper = ({ response = {} }) => (
  <IopHostDetailsIframeTab
    response={response}
    iframeSrc={getComplianceIframeSrc()}
    buildAppRoute={inventoryId => `systems/${inventoryId}`}
    title={__('Compliance')}
    readyMessageType={IOP_COMPLIANCE_READY}
    className="rh-cloud-insights-compliance-host-details-component compliance"
    testId="compliance-host-details-iframe"
  />
);

ComplianceHostDetailsTabWrapper.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.number,
    operatingsystem_name: PropTypes.string,
    insights_attributes: PropTypes.object,
    subscription_facet_attributes: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
};

export default ComplianceHostDetailsTabWrapper;
