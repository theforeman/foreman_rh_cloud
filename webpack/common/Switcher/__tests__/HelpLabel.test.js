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

  it('should render button with correct class', () => {
    render(
      <HelpLabel
        id="some-id"
        text="some-text"
        className="some-class"
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('pf-v5-c-form__group-label-help');
    expect(button).toHaveClass('some-class');
  });

  it('should have onClick handler that prevents default', () => {
    render(
      <HelpLabel
        id="some-id"
        text="some-text"
        className="some-class"
      />
    );
    const button = screen.getByRole('button');
    expect(button.onclick).toBeDefined();

    // Test that onClick prevents default
    const mockEvent = { preventDefault: jest.fn() };
    button.onclick(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
