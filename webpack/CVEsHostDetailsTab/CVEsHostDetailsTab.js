import React from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';
import {
  vulnerabilityDisabled,
  useTabRedirect,
} from '../ForemanRhCloudHelpers';
import './CVEsHostDetailsTab.scss';

const CVEsHostDetailsTab = ({ systemId }) => {
  const scope = 'vulnerability';
  const module = './SystemDetailTable';
  return (
    <div className="rh-cloud-insights-vulnerability-host-details-component vulnerability">
      <ScalprumComponent
        key={systemId}
        scope={scope}
        module={module}
        systemId={systemId}
      />
    </div>
  );
};

CVEsHostDetailsTab.propTypes = {
  systemId: PropTypes.string.isRequired,
};

const CVEsHostDetailsTabWrapper = ({ response }) => {
  const permissions = useInsightsPermissions();
  const isHostDataLoaded = Boolean(response?.id);
  const shouldHideTab = useTabRedirect(
    isHostDataLoaded && vulnerabilityDisabled({ hostDetails: response })
  );

  if (shouldHideTab) {
    return null;
  }

  return (
    <ScalprumProvider {...createProviderOptions(permissions)}>
      <CVEsHostDetailsTab
        // eslint-disable-next-line camelcase
        systemId={response?.subscription_facet_attributes?.uuid}
      />
    </ScalprumProvider>
  );
};

CVEsHostDetailsTabWrapper.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.number,
    operatingsystem_name: PropTypes.string,
    vulnerability: PropTypes.shape({
      enabled: PropTypes.bool,
    }),
    subscription_facet_attributes: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
};

CVEsHostDetailsTabWrapper.defaultProps = {
  response: {},
};

export default CVEsHostDetailsTabWrapper;
