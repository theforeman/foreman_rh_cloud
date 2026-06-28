import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders fetching data message', () => {
    render(<EmptyState />);
    expect(screen.getByText('Fetching data about your accounts')).toBeTruthy();
  });

  it('renders loading indicator', () => {
    render(<EmptyState />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
