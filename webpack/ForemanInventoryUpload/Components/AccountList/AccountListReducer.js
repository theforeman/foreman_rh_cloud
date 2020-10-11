import Immutable from 'seamless-immutable';
import { AUTO_UPLOAD_TOGGLE } from '../AutoUploadSwitcher/AutoUploadSwitcherConstants';
import { HOST_OBFUSCATION_TOGGLE } from '../HostObfuscationSwitcher/HostObfuscationSwitcherConstants';
import { IPS_OBFUSCATION_TOGGLE } from '../IpsObfuscationSwitcher/IpsObfuscationSwitcherConstants';
import { EXCLUDE_PACKAGES_TOGGLE } from '../ExcludePackagesSwitcher/ExcludePackagesSwitcherConstants';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_PROCESS_RESTART,
} from './AccountListConstants';

const initialState = Immutable({
  accounts: {},
  pollingProcessID: 0,
  error: null,
});

export default (state = initialState, action) => {
  const {
    payload: {
      pollingProcessID,
      error,
      accounts,
      accountID,
      processStatusName,
      autoUploadEnabled,
      hostObfuscationEnabled,
      ipsObfuscationEnabled,
      cloudToken,
      excludePackages,
    } = {},
  } = action;

  switch (action.type) {
    case INVENTORY_ACCOUNT_STATUS_POLLING:
      return state.merge({
        ...state,
        accounts,
        autoUploadEnabled,
        hostObfuscationEnabled,
        ipsObfuscationEnabled,
        cloudToken,
        excludePackages,
        error: null,
      });
    case INVENTORY_ACCOUNT_STATUS_POLLING_ERROR:
      return state.merge({
        ...state,
        accounts: {},
        error,
      });
    case INVENTORY_ACCOUNT_STATUS_POLLING_START:
      return state.merge({
        ...state,
        pollingProcessID,
      });
    case INVENTORY_PROCESS_RESTART:
      return state.setIn(['accounts'], {
        ...state.accounts,
        [accountID]: {
          ...state.accounts[accountID],
          [processStatusName]: 'Restarting...',
        },
      });
    case AUTO_UPLOAD_TOGGLE:
      return state.merge({
        ...state,
        autoUploadEnabled,
      });
    case HOST_OBFUSCATION_TOGGLE:
      return state.merge({
        ...state,
        hostObfuscationEnabled,
      });
    case EXCLUDE_PACKAGES_TOGGLE:
      return state.merge({
        ...state,
        excludePackages,
      });
    case IPS_OBFUSCATION_TOGGLE:
      return state.merge({
        ...state,
        ipsObfuscationEnabled,
      });
    default:
      return state;
  }
};
