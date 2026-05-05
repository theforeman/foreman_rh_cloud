import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('renders the error message heading', () => {
    render(<ErrorState error="Something went wrong" />);
    expect(
      screen.getByText(
        'Encountered an error while trying to access the server:'
      )
    ).toBeTruthy();
  });

  it('renders the error description', () => {
    render(<ErrorState error="Connection refused" />);
    expect(screen.getByText('Connection refused')).toBeTruthy();
  });

  it('renders with empty error by default', () => {
    const { container } = render(<ErrorState />);
    expect(container.querySelector('.error_description')).toBeTruthy();
  });
});
