import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItemStatus from '../ListItemStatus';

describe('ListItemStatus', () => {
  it('renders Generated and Uploaded labels', () => {
    render(<ListItemStatus />);
    expect(screen.getByText('Generated')).toBeTruthy();
    expect(screen.getByText('Uploaded')).toBeTruthy();
  });

  it('shows dash placeholders for unknown status', () => {
    render(
      <ListItemStatus
        account={{ generated_status: 'unknown', uploaded_status: 'unknown' }}
      />
    );
    expect(screen.getAllByText('--')).toHaveLength(2);
  });

  it('renders with provided account statuses', () => {
    render(
      <ListItemStatus
        account={{ generated_status: 'success', uploaded_status: 'running' }}
      />
    );
    expect(screen.getByText('Generated')).toBeTruthy();
    expect(screen.getByText('Uploaded')).toBeTruthy();
  });
});
