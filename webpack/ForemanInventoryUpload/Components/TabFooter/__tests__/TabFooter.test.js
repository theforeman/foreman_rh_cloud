import React from 'react';
import { render, screen } from '@testing-library/react';
import TabFooter from '../TabFooter';

describe('TabFooter', () => {
  it('renders children', () => {
    render(<TabFooter><span>Footer content</span></TabFooter>);
    expect(screen.getByText('Footer content')).toBeTruthy();
  });

  it('renders with the tab-footer class', () => {
    const { container } = render(<TabFooter />);
    expect(container.querySelector('.tab-footer')).toBeTruthy();
  });
});
