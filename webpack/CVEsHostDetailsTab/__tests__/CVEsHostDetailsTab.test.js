import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CVEsHostDetailsTabWrapper from '../CVEsHostDetailsTab';

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
      permissions: new Set(['view_vulnerability']),
    },
  }),
  useForemanPermissions: () => new Set(['view_vulnerability']),
}));

const mockUnmountTracker = jest.fn();
jest.mock('@scalprum/react-core', () => {
  const ReactMock = require('react');
  return {
    ScalprumComponent: jest.fn(props => {
      ReactMock.useEffect(() => mockUnmountTracker, []);
      return (
        <div data-testid="mock-scalprum-component">{JSON.stringify(props)}</div>
      );
    }),
    ScalprumProvider: jest.fn(({ children }) => <div>{children}</div>),
  };
});

const defaultResponse = {
  id: 1,
  operatingsystem_name: 'Red Hat Enterprise Linux 8',
  vulnerability: { enabled: true },
  subscription_facet_attributes: { uuid: '1-2-3' },
};

describe('CVEsHostDetailsTabWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <CVEsHostDetailsTabWrapper response={defaultResponse} />
      </MemoryRouter>
    );
    expect(
      container.querySelector(
        '.rh-cloud-insights-vulnerability-host-details-component'
      )
    ).toBeTruthy();
  });

  it('remounts ScalprumComponent when systemId changes', () => {
    const { ScalprumComponent } = require('@scalprum/react-core');

    const responseHostA = {
      ...defaultResponse,
      subscription_facet_attributes: { uuid: 'uuid-host-A' },
    };

    const { rerender } = render(
      <MemoryRouter>
        <CVEsHostDetailsTabWrapper response={responseHostA} />
      </MemoryRouter>
    );

    expect(mockUnmountTracker).not.toHaveBeenCalled();
    expect(ScalprumComponent).toHaveBeenLastCalledWith(
      expect.objectContaining({ systemId: 'uuid-host-A' }),
      expect.anything()
    );

    const responseHostB = {
      ...defaultResponse,
      subscription_facet_attributes: { uuid: 'uuid-host-B' },
    };

    rerender(
      <MemoryRouter>
        <CVEsHostDetailsTabWrapper response={responseHostB} />
      </MemoryRouter>
    );

    expect(mockUnmountTracker).toHaveBeenCalledTimes(1);
    expect(ScalprumComponent).toHaveBeenLastCalledWith(
      expect.objectContaining({ systemId: 'uuid-host-B' }),
      expect.anything()
    );
  });

  it('redirects to Overview when tab should be hidden', () => {
    const nonRhelResponse = {
      id: 2,
      operatingsystem_name: 'Ubuntu 20.04',
      vulnerability: { enabled: false },
      subscription_facet_attributes: { uuid: '1-2-3' },
    };

    const { container } = render(
      <MemoryRouter>
        <CVEsHostDetailsTabWrapper response={nonRhelResponse} />
      </MemoryRouter>
    );

    expect(mockHistoryReplace).toHaveBeenCalledWith('/Overview');
    expect(
      container.querySelector(
        '.rh-cloud-insights-vulnerability-host-details-component'
      )
    ).toBeNull();
  });

  it('does not redirect when host data is not yet loaded', () => {
    const emptyResponse = { subscription_facet_attributes: { uuid: '1-2-3' } };

    render(
      <MemoryRouter>
        <CVEsHostDetailsTabWrapper response={emptyResponse} />
      </MemoryRouter>
    );

    expect(mockHistoryReplace).not.toHaveBeenCalledWith('/Overview');
  });
});
