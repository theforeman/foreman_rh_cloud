import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsightsVulnerabilities from './InsightsVulnerabilities';

describe('InsightsVulnerabilities component', () => {
  it('renders the "under development" message', () => {
    render(<InsightsVulnerabilities />);
    expect(
      screen.getByText(/this page is under development/i)
    ).toBeInTheDocument();
  });

  it('renders the container with correct class', () => {
    const { container } = render(<InsightsVulnerabilities />);
    expect(container.querySelector('.insights-vulnerabilities')).toBeTruthy();
  });
});
