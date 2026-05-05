import React from 'react';
import { render, screen } from '@testing-library/react';
import TabContainer from '../TabContainer';

describe('TabContainer', () => {
  it('renders children', () => {
    render(<TabContainer><span>Tab content</span></TabContainer>);
    expect(screen.getByText('Tab content')).toBeTruthy();
  });

  it('renders with custom className', () => {
    const { container } = render(<TabContainer className="my-tab" />);
    expect(container.querySelector('.my-tab')).toBeTruthy();
  });
});
