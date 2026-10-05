import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IopHostDetailsIframeTab from '../IopHostDetailsIframeTab';
import { OVERVIEW_TAB_PATH } from '../../../ForemanRhCloudHelpers';

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
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

const defaultResponse = {
  id: 1,
  operatingsystem_name: 'Red Hat Enterprise Linux 8',
  insights_attributes: { uuid: 'insights-1' },
  subscription_facet_attributes: { uuid: 'inv-123' },
};

const defaultProps = {
  response: defaultResponse,
  iframeSrc: 'https://example.test/assets/apps/example/index.html',
  buildAppRoute: inventoryId => `systems/${inventoryId}`,
  title: 'Example',
  readyMessageType: 'IOP_EXAMPLE_READY',
  className: 'example-host-tab',
  iframeClassName: 'example-host-iframe',
  testId: 'example-host-iframe',
};

describe('IopHostDetailsIframeTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders iframe and posts host-tab chrome on load', () => {
    const { getByTestId, container } = render(
      <MemoryRouter>
        <IopHostDetailsIframeTab {...defaultProps} />
      </MemoryRouter>
    );

    expect(container.querySelector('.example-host-tab')).toBeTruthy();
    const iframe = getByTestId('example-host-iframe');
    expect(iframe.getAttribute('src')).toBe(defaultProps.iframeSrc);

    fireEvent.load(iframe);

    expect(mockPostChrome).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        appRoute: 'systems/inv-123',
        embedded: 'host-tab',
      })
    );
  });

  it('redirects to Overview when tab should be hidden', () => {
    const { container } = render(
      <MemoryRouter>
        <IopHostDetailsIframeTab
          {...defaultProps}
          response={{
            id: 2,
            operatingsystem_name: 'Ubuntu 20.04',
            insights_attributes: { uuid: 'insights-1' },
            subscription_facet_attributes: { uuid: 'inv-123' },
          }}
        />
      </MemoryRouter>
    );

    expect(mockHistoryReplace).toHaveBeenCalledWith(OVERVIEW_TAB_PATH);
    expect(container.querySelector('.example-host-tab')).toBeNull();
  });
});
