import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HelpLabel } from '../HelpLabel';

describe('HelpLabel', () => {
  it('should render with props', () => {
    render(
      <HelpLabel
        id="some-id"
        text="some-text"
        className="some-class"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('some-class');
  });

  it('should not render when text is empty', () => {
    const { container } = render(
      <HelpLabel
        id="some-id"
        text=""
        className="some-class"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <HelpLabel
        id="some-id"
        text="some-text"
        className="some-class"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'help-text');
  });

  it('should prevent default on button click', () => {
    render(
      <HelpLabel
        id="some-id"
        text="some-text"
        className="some-class"
      />
    );
    const button = screen.getByRole('button');
    const mockEvent = { preventDefault: jest.fn() };
    button.onclick(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
