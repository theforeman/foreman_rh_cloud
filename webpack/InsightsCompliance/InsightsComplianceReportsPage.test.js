import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsightsComplianceReportsPage from './InsightsComplianceReportsPage';

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      permissions: new Set(['view_compliance']),
    },
  }),
  useForemanPermissions: () => new Set(['view_compliance']),
}));

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: jest.fn(props => (
    <div data-testid="mock-scalprum-component">{JSON.stringify(props)}</div>
  )),
  ScalprumProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('InsightsComplianceReportsPage component', () => {
  it('renders the container with correct class', () => {
    const { container } = render(<InsightsComplianceReportsPage />);
    expect(
      container.querySelector('.rh-cloud-insights-compliance-page')
    ).toBeTruthy();
  });
});
