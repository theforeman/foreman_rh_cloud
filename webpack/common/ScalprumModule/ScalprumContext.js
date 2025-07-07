import React from 'react';
import PropTypes from 'prop-types';
import { ScalprumProvider } from '@scalprum/react-core';

export const ScalprumContextWrapper = ({ children }) => {
  const config = {
    vulnerability: {
      name: 'vulnerability',
      manifestLocation: `${window.location.origin}/scalprum/apps/vulnerability/fed-mods.json`,
      cdnPath: `${window.location.origin}/scalprum/apps/vulnerability/`,
    },
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
  return (
    <ScalprumProvider
      pluginSDKOptions={{
        pluginLoaderOptions: {
          transformPluginManifest: manifest => {
            if (manifest.baseURL === 'auto' && config[manifest.name]?.cdnPath) {
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
  );
};

ScalprumContextWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
