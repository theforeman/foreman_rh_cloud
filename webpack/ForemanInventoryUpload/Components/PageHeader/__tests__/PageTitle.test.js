import React from 'react';
import PropTypes from 'prop-types';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageTitle from '../PageTitle';

let mockIopMode = false;

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      foreman_rh_cloud: {
        iop: mockIopMode,
      },
    },
    UI: {},
  }),
}));

jest.mock('../components/CloudPingModal', () => {
  const React = require('react');
  const PropTypes = require('prop-types');

  const MockCloudPingModal = ({ isOpen, title }) =>
    isOpen ? (
      <div role="dialog" aria-label={title}>
        Organization status
      </div>
    ) : null;

  MockCloudPingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
  };

  return {
    __esModule: true,
    default: MockCloudPingModal,
  };
});
jest.mock('foremanReact/common/helpers', () => ({
  getDocsURL: () => '/links/manual/test',
}));

describe('PageTitle', () => {
  afterEach(() => {
    mockIopMode = false;
  });

  it('renders the page title', () => {
    render(<PageTitle />);
    expect(screen.getByText('Red Hat Inventory')).toBeTruthy();
  });

  it('renders the kebab dropdown', () => {
    render(<PageTitle />);
    expect(screen.getByLabelText('Actions')).toBeTruthy();
  });

  it('renders cloud-ping dropdown item when not in IoP mode', async () => {
    mockIopMode = false;
    render(<PageTitle />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Actions'));
    });

    // Verify all dropdown items are present
    const connectivityItem = screen.getByText('Connectivity test');
    expect(connectivityItem).toBeTruthy();

    const tasksHistoryLink = screen.getByRole('menuitem', {
      name: 'Actions history',
    });
    const inventoryDocsLink = screen.getByRole('menuitem', {
      name: 'Documentation',
    });

    expect(tasksHistoryLink).toBeTruthy();
    expect(inventoryDocsLink).toBeTruthy();

    // Verify links open in a new tab
    expect(tasksHistoryLink).toHaveAttribute('target', '_blank');
    expect(inventoryDocsLink).toHaveAttribute('target', '_blank');

    // Verify links have the expected URL patterns
    expect(tasksHistoryLink.getAttribute('href')).toContain(
      '/foreman_tasks/tasks'
    );
    expect(inventoryDocsLink.getAttribute('href')).toContain('/links/manual/');
  });

  it('opens CloudPingModal when clicking Connectivity test', async () => {
    mockIopMode = false;
    render(<PageTitle />);

    // Modal should not be visible initially
    expect(screen.queryByRole('dialog')).toBeNull();

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Actions'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Connectivity test'));
    });

    // Modal should now be visible
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog).toHaveTextContent('Organization status');
  });

  it('does not render cloud-ping dropdown item when in IoP mode', async () => {
    mockIopMode = true;
    render(<PageTitle />);
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Actions'));
    });
    expect(screen.queryByText('Connectivity test')).toBeNull();
    mockIopMode = false;
  });
});
