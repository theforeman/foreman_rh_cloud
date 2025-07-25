import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { screen, render } from '@testing-library/react';
import { PageDescription } from '../PageDescription';

jest.mock('react-intl', () => {
  const actualReactIntl = jest.requireActual('react-intl');
  return {
    ...actualReactIntl,
    FormattedMessage: ({ defaultMessage, id }) => defaultMessage || id,
    useIntl: () => ({
      formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
    }),
  };
});
jest.mock('foremanReact/common/helpers', () => ({ getDocsURL: () => {} }));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('PageDescription', () => {
  test('when subscription connection is enabled', () => {
    const renderOptions = {
      API: {
        INVENTORY_SETTINGS: {
          response: { subscriptionConnectionEnabled: true },
        },
      },
    };
    const store = mockStore(renderOptions);

    render(
      <Provider store={store}>
        <PageDescription />
      </Provider>
    );
    expect(
      screen.queryAllByText(
        /To enable this reporting for all Foreman organizations/
      )
    ).toHaveLength(1);
  });

  test('when subscription connection is not enabled', () => {
    const renderOptions = {
      API: {
        INVENTORY_SETTINGS: {
          response: { subscriptionConnectionEnabled: false },
        },
      },
    };
    const store = mockStore(renderOptions);

    render(
      <Provider store={store}>
        <PageDescription />
      </Provider>
    );

    expect(
      screen.queryAllByText(
        /To enable this reporting for all Foreman organizations/
      )
    ).toHaveLength(0);
  });
});
