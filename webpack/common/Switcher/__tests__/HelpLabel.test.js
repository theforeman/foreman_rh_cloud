import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HelpLabel } from '../HelpLabel';

describe('InsightsCloudSync helpers', () => {
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
});
