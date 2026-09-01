import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Toast from '../Toast';

jest.mock('foremanReact/common/I18n', () => ({
  translate: jest.fn(str => str),
}));

const renderToast = (props = {}) =>
  render(
    <MemoryRouter>
      <Toast syncHosts={5} disconnectHosts={3} {...props} />
    </MemoryRouter>
  );

const omittedText =
  'Excluded from upload to console.redhat.com Inventory service because host_registration_insights_inventory parameter value is false:';

describe('Toast', () => {
  it('renders with all three status counts including user_omitted', () => {
    renderToast({ userOmittedHosts: 2 });

    expect(screen.getByRole('link', { name: '10' })).toHaveAttribute(
      'href',
      '/new/hosts?search=set%3F+subscription_uuid&page=1'
    );
    expect(screen.getByRole('link', { name: '5' })).toHaveAttribute(
      'href',
      '/new/hosts?search=insights_inventory_sync_status+%3D+sync&page=1'
    );
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute(
      'href',
      '/new/hosts?search=insights_inventory_sync_status+%3D+disconnect&page=1'
    );
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute(
      'href',
      '/new/hosts?search=insights_inventory_sync_status+%3D+user_omitted&page=1'
    );
    expect(screen.getByText(omittedText, { exact: false })).toBeInTheDocument();
  });

  it('does not render user_omitted section when count is 0', () => {
    renderToast({ userOmittedHosts: 0 });

    expect(screen.getByRole('link', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '2' })).not.toBeInTheDocument();
    expect(
      screen.queryByText(omittedText, { exact: false })
    ).not.toBeInTheDocument();
  });

  it('renders without crashing when userOmittedHosts is not provided (default)', () => {
    renderToast();

    expect(screen.getByRole('link', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '3' })).toBeInTheDocument();
    expect(
      screen.queryByText(omittedText, { exact: false })
    ).not.toBeInTheDocument();
  });

  it('renders correct status links for each category', () => {
    renderToast({ userOmittedHosts: 2 });

    expect(screen.getByRole('link', { name: '5' })).toHaveAttribute(
      'href',
      expect.stringContaining('sync')
    );
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute(
      'href',
      expect.stringContaining('disconnect')
    );
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute(
      'href',
      expect.stringContaining('user_omitted')
    );
  });
});
