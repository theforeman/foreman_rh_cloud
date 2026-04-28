import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedInventoryFilter from '../index';
import { INVENTORY_FILTER_UPDATE } from '../InventoryFilterConstants';

jest.mock('foremanReact/Root/Context/ForemanContext');

const mockStore = configureMockStore([thunk]);

describe('InventoryFilter integration test', () => {
  it('dispatches filter update action on input change', () => {
    const store = mockStore({
      ForemanRhCloud: {
        inventoryUpload: {
          inventoryFilter: { filterTerm: '' },
        },
      },
    });

    render(
      <Provider store={store}>
        <ConnectedInventoryFilter />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Filter..');
    fireEvent.change(input, { target: { value: 'some_new_filter' } });

    const actions = store.getActions();
    const filterAction = actions.find(
      a => a.type === INVENTORY_FILTER_UPDATE && a.payload.filterTerm === 'some_new_filter'
    );
    expect(filterAction).toBeTruthy();
  });
});
