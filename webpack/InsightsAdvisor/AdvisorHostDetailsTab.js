import React from 'react';
import PropTypes from 'prop-types';
import IopHostDetailsIframeTab from '../common/IopIframe/IopHostDetailsIframeTab';
import { getAdvisorIframeSrc } from './advisorIframeHelpers';
import { IOP_ADVISOR_READY } from './advisorIframeConstants';

const buildAppRoute = inventoryId => `systems/${encodeURIComponent(inventoryId)}`;
const AdvisorHostDetailsTab = ({ response }) => (
  <IopHostDetailsIframeTab
    response={response}
    iframeSrc={getAdvisorIframeSrc()}
    buildAppRoute={buildAppRoute}
    title="Advisor"
    readyMessageType={IOP_ADVISOR_READY}
    testId="advisor-host-details-iframe"
  />
);
AdvisorHostDetailsTab.propTypes = { response: PropTypes.object };
AdvisorHostDetailsTab.defaultProps = { response: {} };
export default AdvisorHostDetailsTab;
