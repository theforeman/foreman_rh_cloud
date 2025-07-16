import React from 'react';
import { render } from '@testing-library/react';
import CVEsHostDetailsTabWrapper from '../CVEsHostDetailsTab';

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: jest.fn(props => (
    <div data-testid="mock-scalprum-component">{JSON.stringify(props)}</div>
  )),
  ScalprumProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('CVEsHostDetailsTabWrapper', () => {
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
});
