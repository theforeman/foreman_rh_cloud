import React from 'react';
import { mount } from '@theforeman/test';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { ErrorEmptyState } from '../ErrorEmptyState';

const mockStore = configureMockStore();
const store = mockStore({});
describe('ErrorEmptyState', () => {
  it('render', () => {
    const component = mount(
      <Provider store={store}>
        <ErrorEmptyState />
      </Provider>
    );
    expect(component).toMatchSnapshot();
  });
});
