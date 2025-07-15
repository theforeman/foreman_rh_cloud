import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent } from '@scalprum/react-core';
import { ScalprumContext } from './ScalprumContext';
// const scope = 'advisor';
// const module = './RulesTableWrapped';
// const path = `apps/${scope}`;
// const manifestLocation = `/${path}/fed-mods.json`;

export const RhCloudScalprumComponent = ({
  scope,
  path,
  module,
  manifestLocation,
  ...props
}) => {
  const { config, setConfig } = useContext(ScalprumContext);

  useEffect(() => {
    setConfig({
      [scope]: {
        name: scope,
        manifestLocation,
        cdnPath: `${window.location.origin}/${path}/`,
      },
    });
  }, [setConfig, manifestLocation, path, scope]);

  if (!config[scope]) return null;
  return <ScalprumComponent scope={scope} module={module} {...props} />;
};

RhCloudScalprumComponent.propTypes = {
  scope: PropTypes.string.isRequired,
  module: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  manifestLocation: PropTypes.string.isRequired,
};

export default RhCloudScalprumComponent;
