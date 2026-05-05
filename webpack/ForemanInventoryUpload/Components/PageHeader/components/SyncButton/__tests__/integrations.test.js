import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as API from 'foremanReact/redux/API';
import ConnectedSyncButton from '../index';
import { successResponse } from './SyncButtonFixtures';
import { INVENTORY_SYNC } from '../SyncButtonConstants';

jest.spyOn(API, 'post');

const mockStore = configureMockStore([thunk]);

describe('SyncButton integration test', () => {
  it('dispatches sync action when button is clicked', () => {
    API.post.mockImplementation(({ handleSuccess, key, ...action }) => {
      if (key === INVENTORY_SYNC && handleSuccess) {
        handleSuccess(successResponse);
      }
      return { type: 'API_POST', ...action };
    });

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
