import React from 'react';
import PropTypes from 'prop-types';
import {
  isNotRhelHost,
  hasNoInsightsFacet,
  useTabRedirect,
} from '../../ForemanRhCloudHelpers';
import IopHostDetailsIframe from './IopHostDetailsIframe';

/**
 * Host-details fill wrapper: hide/redirect for non-RHEL / no Insights facet,
 * then render an IoP app iframe for the subscription UUID.
 */
const IopHostDetailsIframeTab = ({
  response = {},
  iframeSrc,
  buildAppRoute,
  title,
  readyMessageType,
  className = '',
  iframeClassName = 'rh-cloud-iop-host-details-iframe',
  testId = 'iop-host-details-iframe',
}) => {
  const isHostDataLoaded = Boolean(response?.id);
  console.log('DEBUG response', response);
  const shouldHideTab = useTabRedirect(
    isHostDataLoaded &&
      (isNotRhelHost({ hostDetails: response }) ||
        hasNoInsightsFacet({ response, hostDetails: response }))
  );

  if (shouldHideTab) {
    return null;
  }

  const inventoryId = response?.subscription_facet_attributes?.uuid;

  if (!inventoryId) {
    return null;
  }

  return (
    <IopHostDetailsIframe
      inventoryId={inventoryId}
      iframeSrc={iframeSrc}
      appRoute={buildAppRoute(inventoryId)}
      title={title}
      readyMessageType={readyMessageType}
      className={className}
      iframeClassName={iframeClassName}
      testId={testId}
    />
  );
};

IopHostDetailsIframeTab.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.number,
    operatingsystem_name: PropTypes.string,
    insights_attributes: PropTypes.object,
    subscription_facet_attributes: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
  iframeSrc: PropTypes.string.isRequired,
  buildAppRoute: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  readyMessageType: PropTypes.string.isRequired,
  className: PropTypes.string,
  iframeClassName: PropTypes.string,
  testId: PropTypes.string,
};

export default IopHostDetailsIframeTab;
