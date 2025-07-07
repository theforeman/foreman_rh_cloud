export const modulesConfig = {
  vulnerability: {
    name: 'vulnerability',
    manifestLocation: `${window.location.origin}/assets/apps/vulnerability/fed-mods.json`,
    cdnPath: `${window.location.origin}/assets/apps/vulnerability/`,
  },
};

export const mockUser = {
  entitlements: {},
  identity: {
    account_number: 'string',
    org_id: 'FOREMAN',
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

export const providerOptions = {
  pluginSDKOptions: {
    pluginLoaderOptions: {
      transformPluginManifest: manifest => {
        if (
          manifest.baseURL === 'auto' &&
          modulesConfig[manifest.name]?.cdnPath
        ) {
          const _cdnPath = modulesConfig[manifest.name]?.cdnPath;
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
  },
  api: {
    chrome: {
      isBeta: () => false,
      on: () => {},
      auth: {
        getUser: () => Promise.resolve(mockUser),
      },
    },
  },
  config: modulesConfig,
};
