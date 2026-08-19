import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedSyncButton from '../index';

const mockStore = configureMockStore([thunk]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('SyncButton integration test', () => {
  it('dispatches sync action when button is clicked', () => {
    const store = mockStore({
      API: {},
    });

    render(
      <Provider store={store}>
        <ConnectedSyncButton />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button'));

    const actions = store.getActions();
    const syncAction = actions.find(a => a.type === 'API_POST');
    expect(syncAction).toBeTruthy();
  });
});
