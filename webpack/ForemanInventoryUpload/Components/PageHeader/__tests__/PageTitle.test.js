import React from 'react';
import { render, screen } from '@testing-library/react';
import PageTitle from '../PageTitle';

jest.mock('../components/CloudPingModal', () => () => (
  <div data-testid="cloud-ping-modal">CloudPingModal</div>
));
jest.mock('foremanReact/common/helpers', () => ({ getDocsURL: () => {} }));

describe('PageTitle', () => {
  it('renders the page title', () => {
    render(<PageTitle />);
    expect(screen.getByText('Red Hat Inventory')).toBeTruthy();
  });

  it('renders the kebab dropdown', () => {
    const { container } = render(<PageTitle />);
    expect(container.querySelector('.title-dropdown')).toBeTruthy();
  });
});
