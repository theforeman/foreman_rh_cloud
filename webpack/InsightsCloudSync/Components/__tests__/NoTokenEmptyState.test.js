import React from 'react';
import { mount } from '@theforeman/test';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { NoTokenEmptyState } from '../NoTokenEmptyState';

const mockStore = configureMockStore();
const store = mockStore({});
describe('NoTokenEmptyState', () => {
  it('render', () => {
    const component = mount(
      <Provider store={store}>
        <NoTokenEmptyState />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});
