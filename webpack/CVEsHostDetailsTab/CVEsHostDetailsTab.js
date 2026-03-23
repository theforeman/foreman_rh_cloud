import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';
import { vulnerabilityDisabled } from '../ForemanRhCloudHelpers';
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
  const history = useHistory();
  const permissions = useInsightsPermissions();
  const isHostDataLoaded = Boolean(response?.id);
  const shouldHideTab =
    isHostDataLoaded && vulnerabilityDisabled({ hostDetails: response });

  useEffect(() => {
    if (shouldHideTab && history) {
      history.replace('/Overview');
    }
  }, [shouldHideTab, history]);

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
    subscription_facet_attributes: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
};

CVEsHostDetailsTabWrapper.defaultProps = {
  response: {},
};

export default CVEsHostDetailsTabWrapper;
