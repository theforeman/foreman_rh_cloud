import React, { useState, createContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ScalprumProvider } from '@scalprum/react-core';

export const ScalprumContext = createContext(null);

/* 
Wrap your component with ScalprumContextWrapper:
 <ScalprumContextWrapper>
      <WrappedComponent />
    </ScalprumContextWrapper>
inside the WrappedComponent (not the component that loads the wrapper), use useEffect and setConfig:
  const { config, setConfig } = React.useContext(ScalprumContext);
  const path = 'apps/landing'
  const scope = 'landing'
  const module = './AnsibleWidget'
  const newConfig = {
    [scope]: {
      name: scope,
      manifestLocation: `${window.location.origin}/scalprum/${cdnPath}/fed-mods.json`,
      cdnPath: `${window.location.origin}/scalprum/${cdnPath}/`,
    },
  };
  useEffect(() => {
    setConfig(newConfig) 
  },[])

  Load ScalprumComponent conditionally to the config being set
  {config[scope] && (
          <ScalprumComponent scope={scope} module={module}` />
        )}
*/

export const ScalprumContextWrapper = ({ children }) => {
  const [config, setConfig] = useState({});
  const contextData = {
    config,
    setConfig: useCallback(
      newConfig => setConfig(prev => ({ ...prev, ...newConfig })),
      []
    ),
  };

  const mockUser = {
    entitlements: {},
    identity: {
      account_number: 'string',
      org_id: 'string',
      internal: {
        org_id: 'string',
        account_id: 'string',
      },
      type: 'string',
      user: {
        username: 'string',
        email: 'string',
        first_name: 'string',
        last_name: 'string',
        is_active: 'boolean',
        is_internal: 'boolean',
        is_org_admin: 'boolean',
        locale: 'string',
      },
    },
  };
  if (Object.keys(config).length)
    return (
      <ScalprumContext.Provider value={contextData}>
        <ScalprumProvider
          pluginSDKOptions={{
            pluginLoaderOptions: {
              transformPluginManifest: manifest => {
                if (
                  manifest.baseURL === 'auto' &&
                  config[manifest.name]?.cdnPath
                ) {
                  const _cdnPath = config[manifest.name]?.cdnPath;
                  return {
                    ...manifest,
                    baseURL: _cdnPath,
                    loadScripts: manifest.loadScripts.map(
                      script => `${_cdnPath}${script}`
                    ),
                  };
                }
                return manifest;
              },
            },
          }}
          api={{
            chrome: {
              isBeta: () => false,
              on: () => {},
              auth: {
                getUser: () => Promise.resolve(mockUser),
              },
            },
          }}
          config={config}
        >
          {children}
        </ScalprumProvider>
      </ScalprumContext.Provider>
    );

  return (
    <ScalprumContext.Provider value={contextData}>
      {children}
    </ScalprumContext.Provider>
  );
};

ScalprumContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
