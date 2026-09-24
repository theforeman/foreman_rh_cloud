import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComplianceHostDetailsTabWrapper from '../ComplianceHostDetailsTab';
import { OVERVIEW_TAB_PATH } from '../../ForemanRhCloudHelpers';

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

jest.mock('foremanReact/common/I18n', () => ({
  translate: str => str,
  sprintf: str => str,
}));

jest.mock('../../InsightsCompliance/complianceIframeHelpers', () => ({
  getComplianceIframeSrc: () =>
    'https://example.test/assets/apps/compliance/index.html',
}));

const mockPostChrome = jest.fn();
jest.mock('../../common/IopIframe/postIopChromeToIframe', () => ({
  postIopChromeToIframe: (...args) => mockPostChrome(...args),
}));

const defaultResponse = {
  id: 1,
  operatingsystem_name: 'Red Hat Enterprise Linux 8',
  insights_attributes: { uuid: 'insights-1' },
  subscription_facet_attributes: { uuid: '1-2-3' },
};

describe('ComplianceHostDetailsTabWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders compliance iframe for a valid host without redirecting', () => {
    const { getByTestId, container } = render(
      <MemoryRouter>
        <ComplianceHostDetailsTabWrapper response={defaultResponse} />
      </MemoryRouter>
    );

    expect(
      container.querySelector(
        '.rh-cloud-insights-compliance-host-details-component'
      )
    ).toBeTruthy();

    const iframe = getByTestId('compliance-host-details-iframe');
    expect(iframe.getAttribute('src')).toBe(
      'https://example.test/assets/apps/compliance/index.html'
    );
    expect(mockHistoryReplace).not.toHaveBeenCalled();
  });

  it('posts systems/<uuid> appRoute for the host-tab iframe', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <ComplianceHostDetailsTabWrapper response={defaultResponse} />
      </MemoryRouter>
    );

    fireEvent.load(getByTestId('compliance-host-details-iframe'));

    expect(mockPostChrome).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        appRoute: 'systems/1-2-3',
        embedded: 'host-tab',
      })
    );
  });

  it('posts updated appRoute when inventoryId changes', () => {
    const responseHostA = {
      ...defaultResponse,
      subscription_facet_attributes: { uuid: 'uuid-host-A' },
    };

    const { rerender, getByTestId } = render(
      <MemoryRouter>
        <ComplianceHostDetailsTabWrapper response={responseHostA} />
      </MemoryRouter>
    );

    expect(getByTestId('compliance-host-details-iframe')).toBeTruthy();

    const responseHostB = {
      ...defaultResponse,
      subscription_facet_attributes: { uuid: 'uuid-host-B' },
    };

    rerender(
      <MemoryRouter>
        <ComplianceHostDetailsTabWrapper response={responseHostB} />
      </MemoryRouter>
    );

    fireEvent.load(getByTestId('compliance-host-details-iframe'));

    expect(mockPostChrome).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        appRoute: 'systems/uuid-host-B',
        embedded: 'host-tab',
      })
    );
  });

  it('redirects to Overview when tab should be hidden', () => {
    const nonRhelResponse = {
      id: 2,
      operatingsystem_name: 'Ubuntu 20.04',
      insights_attributes: { uuid: 'insights-1' },
      subscription_facet_attributes: { uuid: '1-2-3' },
    };

    const { container } = render(
      <MemoryRouter>
        <ComplianceHostDetailsTabWrapper response={nonRhelResponse} />
      </MemoryRouter>
    );

    expect(mockHistoryReplace).toHaveBeenCalledWith(OVERVIEW_TAB_PATH);
    expect(
      container.querySelector(
        '.rh-cloud-insights-compliance-host-details-component'
      )
    ).toBeNull();
  });

  it('does not redirect when host data is not yet loaded', () => {
    const emptyResponse = { subscription_facet_attributes: { uuid: '1-2-3' } };

    render(
      <MemoryRouter>
        <ComplianceHostDetailsTabWrapper response={emptyResponse} />
      </MemoryRouter>
    );

    expect(mockHistoryReplace).not.toHaveBeenCalled();
  });
});
