import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ForemanInventoryUpload from '../ForemanInventoryUpload';

jest.mock('../Components/PageHeader', () => () => (
  <div data-testid="page-header">PageHeader</div>
));
jest.mock('../Components/AccountList', () => () => (
  <div data-testid="account-list">AccountList</div>
));
jest.mock('foremanReact/routes/common/PageLayout/PageLayout', () => ({
  children,
}) => <div data-testid="page-layout">{children}</div>);

const mockStore = configureMockStore([thunk]);

describe('ForemanInventoryUpload', () => {
  it('renders the page with correct class', () => {
    const store = mockStore({});
    const { container } = render(
      <Provider store={store}>
        <ForemanInventoryUpload />
      </Provider>
    );
    expect(container.querySelector('.rh-cloud-inventory-page')).toBeTruthy();
  });
});
