import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import IopAppIframe from '../IopAppIframe';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      permissions: new Set(['view_hosts']),
    },
  }),
  useForemanPermissions: () => new Set(['view_hosts']),
}));

const mockPostChrome = jest.fn();
jest.mock('../postIopChromeToIframe', () => ({
  postIopChromeToIframe: (...args) => mockPostChrome(...args),
}));

const routePrefix = '/foreman_rh_cloud/insights_example';

const defaultProps = {
  appName: 'Example',
  iframeSrc: 'https://example.test/assets/apps/example/index.html',
  getAppRoute: pathname =>
    pathname.startsWith(routePrefix)
      ? pathname.slice(routePrefix.length).replace(/^\//, '') || 'dashboard'
      : 'dashboard',
  getForemanPath: appRoute => `${routePrefix}/${appRoute}`,
  defaultAppRoute: 'dashboard',
  readyMessageType: 'IOP_EXAMPLE_READY',
  navigateMessageType: 'IOP_EXAMPLE_NAVIGATE',
  className: 'example-iframe',
  testId: 'example-iframe',
};

describe('IopAppIframe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts chrome context derived from the Foreman pathname', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={[`${routePrefix}/cves`]}>
        <Route path="*">
          <IopAppIframe {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    fireEvent.load(getByTestId('example-iframe'));

    expect(mockPostChrome).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        appRoute: 'cves',
        pathname: `${routePrefix}/cves`,
      })
    );
  });

  it('pushes Foreman path when the iframe sends NAVIGATE', () => {
    render(
      <MemoryRouter initialEntries={[`${routePrefix}/dashboard`]}>
        <Route path="*">
          <IopAppIframe {...defaultProps} />
        </Route>
      </MemoryRouter>
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: {
          type: 'IOP_EXAMPLE_NAVIGATE',
          payload: { appRoute: 'cves/cve-1' },
        },
      })
    );

    expect(mockHistoryPush).toHaveBeenCalledWith(`${routePrefix}/cves/cve-1`);
  });
});
