import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelpLabel } from '../HelpLabel';

describe('HelpLabel', () => {
  it('renders nothing when text is empty', () => {
    const { container } = render(<HelpLabel id="test-id" text="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when text is not provided', () => {
    const { container } = render(<HelpLabel id="test-id" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a button when text is provided', () => {
    render(<HelpLabel id="test-id" text="Help text" />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('applies the provided className', () => {
    render(
      <HelpLabel id="test-id" text="Help text" className="custom-class" />
    );
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });
});
