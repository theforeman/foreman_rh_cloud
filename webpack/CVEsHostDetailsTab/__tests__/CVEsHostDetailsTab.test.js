import React from 'react';
import { render } from '@testing-library/react';
import CVEsHostDetailsTabWrapper from '../CVEsHostDetailsTab';

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

describe('CVEsHostDetailsTabWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <CVEsHostDetailsTabWrapper
        response={{ subscription_facet_attributes: { uuid: '1-2-3' } }}
      />
    );
    expect(
      container.querySelector(
        '.rh-cloud-insights-vulnerability-host-details-component'
      )
    ).toBeTruthy();
  });

  it('remounts ScalprumComponent when systemId changes', () => {
    const { ScalprumComponent } = require('@scalprum/react-core');

    const { rerender } = render(
      <CVEsHostDetailsTabWrapper
        response={{ subscription_facet_attributes: { uuid: 'uuid-host-A' } }}
      />
    );

    expect(mockUnmountTracker).not.toHaveBeenCalled();
    expect(ScalprumComponent).toHaveBeenLastCalledWith(
      expect.objectContaining({ systemId: 'uuid-host-A' }),
      expect.anything()
    );

    rerender(
      <CVEsHostDetailsTabWrapper
        response={{ subscription_facet_attributes: { uuid: 'uuid-host-B' } }}
      />
    );

    expect(mockUnmountTracker).toHaveBeenCalledTimes(1);
    expect(ScalprumComponent).toHaveBeenLastCalledWith(
      expect.objectContaining({ systemId: 'uuid-host-B' }),
      expect.anything()
    );
  });
});
