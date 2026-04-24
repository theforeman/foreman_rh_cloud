import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SyncButton from '../SyncButton';

describe('SyncButton', () => {
  it('renders the sync button text', () => {
    render(<SyncButton handleSync={jest.fn()} />);
    expect(screen.getByText(/Sync all inventory status/)).toBeTruthy();
  });

  it('calls handleSync on click', () => {
    const handleSync = jest.fn();
    render(<SyncButton handleSync={handleSync} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleSync).toHaveBeenCalledTimes(1);
  });

  it('disables button when status is PENDING', () => {
    render(<SyncButton handleSync={jest.fn()} status="PENDING" />);
    expect(screen.getByRole('button').disabled).toBe(true);
  });

  it('enables button when status is not PENDING', () => {
    render(<SyncButton handleSync={jest.fn()} status="RESOLVED" />);
    expect(screen.getByRole('button').disabled).toBe(false);
  });
});
