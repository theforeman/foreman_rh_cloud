import React from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { providerOptions } from '../common/ScalprumModule/ScalprumContext';
import './CVEsHostDetailsTab.scss';

const CVEsHostDetailsTab = ({ systemId }) => {
  const scope = 'vulnerability';
  const module = './SystemDetailTable';
  return (
    <div className="rh-cloud-insights-vulnerability-host-details-component">
      <ScalprumComponent scope={scope} module={module} systemId={systemId} />
    </div>
  );
};

CVEsHostDetailsTab.propTypes = {
  systemId: PropTypes.string.isRequired,
};

const CVEsHostDetailsTabWrapper = ({ response }) => (
  <ScalprumProvider {...providerOptions}>
    <CVEsHostDetailsTab
      // eslint-disable-next-line camelcase
      systemId={response?.subscription_facet_attributes?.uuid}
    />
  </ScalprumProvider>
);

CVEsHostDetailsTabWrapper.propTypes = {
  response: PropTypes.shape({
    subscription_facet_attributes: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default CVEsHostDetailsTabWrapper;
