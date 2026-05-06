import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_PROCESS_RESTART,
} from '../AccountListConstants';
import reducer from '../AccountListReducer';
import {
  error,
  pollingProcessID,
  accountID,
  processStatusName,
  pollingResponse,
  accounts,
  CloudConnectorStatus,
} from '../AccountList.fixtures';

describe('AccountList reducer', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.accounts).toEqual({});
    expect(state.pollingProcessID).toBe(0);
    expect(state.error).toBeNull();
  });

  it('handles INVENTORY_ACCOUNT_STATUS_POLLING', () => {
    const state = reducer(undefined, {
      type: INVENTORY_ACCOUNT_STATUS_POLLING,
      payload: pollingResponse,
    });
    expect(state.accounts).toEqual(accounts);
    expect(state.CloudConnectorStatus).toEqual(CloudConnectorStatus);
    expect(state.error).toBeNull();
  });

  it('handles INVENTORY_ACCOUNT_STATUS_POLLING_ERROR', () => {
    const state = reducer(undefined, {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
      payload: { error },
    });
    expect(state.accounts).toEqual({});
    expect(state.error).toBe(error);
  });

  it('handles INVENTORY_ACCOUNT_STATUS_POLLING_START', () => {
    const state = reducer(undefined, {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_START,
      payload: { pollingProcessID },
    });
    expect(state.pollingProcessID).toBe(pollingProcessID);
  });

  it('handles INVENTORY_ACCOUNT_STATUS_POLLING_STOP (default case)', () => {
    const prevState = reducer(undefined, {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_START,
      payload: { pollingProcessID },
    });
    const state = reducer(prevState, {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
    });
    expect(state.pollingProcessID).toBe(pollingProcessID);
    expect(state.accounts).toEqual({});
    expect(state.error).toBeNull();
  });

  it('handles INVENTORY_PROCESS_RESTART', () => {
    const stateWithAccounts = reducer(undefined, {
      type: INVENTORY_ACCOUNT_STATUS_POLLING,
      payload: pollingResponse,
    });
    const state = reducer(stateWithAccounts, {
      type: INVENTORY_PROCESS_RESTART,
      payload: { accountID, processStatusName },
    });
    expect(state.accounts[accountID][processStatusName]).toBe('Restarting...');
  });
});
