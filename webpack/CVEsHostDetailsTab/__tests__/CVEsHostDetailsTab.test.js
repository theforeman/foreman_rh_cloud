import React from 'react';
import { render, screen } from '@testing-library/react';
import CVEsHostDetailsTab from '../CVEsHostDetailsTab';

describe('CVEsHostDetailsTab', () => {
  it('renders without crashing', () => {
    render(<CVEsHostDetailsTab hostName="test-host.example.com" />);
    expect(
      screen.getByText('CVEs tab for host: test-host.example.com')
    ).toBeTruthy();
  });

  it('renders the host name', () => {
    const hostName = 'test-host.example.com';
    render(<CVEsHostDetailsTab hostName={hostName} />);
    expect(screen.getByText(`CVEs tab for host: ${hostName}`)).toBeTruthy();
  });
});
