import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { screen, render } from '@testing-library/react';
import { noop } from 'foremanReact/common/helpers';
import * as ConfigHooks from '../../../../common/Hooks/ConfigHooks';
import TabHeader from '../TabHeader';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../../common/Hooks/ConfigHooks');

describe('TabHeader', () => {
  beforeEach(() => {
    ConfigHooks.useIopConfig = jest.fn();
  });

  test('when subscription connection is enabled and not IoP', () => {
    ConfigHooks.useIopConfig.mockReturnValue(false);
    const renderOptions = {
      API: {
        INVENTORY_SETTINGS: {
          response: { subscriptionConnectionEnabled: true },
        },
      },
    };
    const store = mockStore(renderOptions);

    const { container } = render(
      <Provider store={store}>
        <TabHeader exitCode="exit 0" onRestart={noop} toggleFullScreen={noop} />
      </Provider>
    );
    expect(screen.queryAllByText('Generate and upload report')).toHaveLength(1);
    expect(screen.queryAllByText('Full Screen')).toHaveLength(1);
    const button = container.querySelector('button[class*="btn-primary"]');
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  test('when subscription connection is not enabled and not IoP - button is disabled with tooltip', () => {
    ConfigHooks.useIopConfig.mockReturnValue(false);
    const renderOptions = {
      API: {
        INVENTORY_SETTINGS: {
          response: { subscriptionConnectionEnabled: false },
        },
      },
    };
    const store = mockStore(renderOptions);

    const { container } = render(
      <Provider store={store}>
        <TabHeader exitCode="exit 0" onRestart={noop} toggleFullScreen={noop} />
      </Provider>
    );

    expect(screen.queryAllByText('Generate report')).toHaveLength(1);
    expect(screen.queryAllByText('Full Screen')).toHaveLength(1);
    const button = container.querySelector('button[class*="btn-primary"]');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  test('when subscription connection is not enabled but IoP is enabled - button is enabled', () => {
    ConfigHooks.useIopConfig.mockReturnValue(true);
    const renderOptions = {
      API: {
        INVENTORY_SETTINGS: {
          response: { subscriptionConnectionEnabled: false },
        },
      },
    };
    const store = mockStore(renderOptions);

    const { container } = render(
      <Provider store={store}>
        <TabHeader exitCode="exit 0" onRestart={noop} toggleFullScreen={noop} />
      </Provider>
    );

    expect(screen.queryAllByText('Generate report')).toHaveLength(1);
    const button = container.querySelector('button[class*="btn-primary"]');
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  test('when IoP is enabled and subscription connection is enabled - button is enabled', () => {
    ConfigHooks.useIopConfig.mockReturnValue(true);
    const renderOptions = {
      API: {
        INVENTORY_SETTINGS: {
          response: { subscriptionConnectionEnabled: true },
        },
      },
    };
    const store = mockStore(renderOptions);

    const { container } = render(
      <Provider store={store}>
        <TabHeader exitCode="exit 0" onRestart={noop} toggleFullScreen={noop} />
      </Provider>
    );

    expect(screen.queryAllByText('Generate and upload report')).toHaveLength(1);
    const button = container.querySelector('button[class*="btn-primary"]');
    expect(button.hasAttribute('disabled')).toBe(false);
  });
});
