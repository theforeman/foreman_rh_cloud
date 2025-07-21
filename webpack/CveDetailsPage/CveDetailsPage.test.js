import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CveDetailsPage from './CveDetailsPage';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ cveId: 'CVE-2021-1234' })),
}));

jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: jest.fn(props => (
    <div data-testid="mock-scalprum-component">{JSON.stringify(props)}</div>
  )),
  ScalprumProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('CveDetailsPage component', () => {
  it('renders the container with correct class', () => {
    const { container } = render(<CveDetailsPage />);
    expect(
      container.querySelector('.rh-cloud-cve-details-page')
    ).toBeTruthy();
  });

  it('passes cveId from URL params to ScalprumComponent', () => {
    const { getByTestId } = render(<CveDetailsPage />);
    const mockComponent = getByTestId('mock-scalprum-component');
    expect(mockComponent.textContent).toContain('CVE-2021-1234');
  });
});
