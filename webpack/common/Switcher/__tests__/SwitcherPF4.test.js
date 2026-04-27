import React from 'react';
import { render, screen } from '@testing-library/react';
import SwitcherPF4 from '../SwitcherPF4';

describe('SwitcherPF4', () => {
  const defaultProps = {
    id: 'test-id',
    label: 'Test Label',
    tooltip: 'Test tooltip',
    onChange: jest.fn(),
  };

  it('renders the switch', () => {
    render(<SwitcherPF4 {...defaultProps} />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('renders the label text', () => {
    render(<SwitcherPF4 {...defaultProps} />);
    expect(screen.getAllByText('Test Label').length).toBeGreaterThan(0);
  });

  it('is checked by default', () => {
    render(<SwitcherPF4 {...defaultProps} />);
    expect(screen.getByRole('checkbox').checked).toBe(true);
  });

  it('respects isChecked prop', () => {
    render(<SwitcherPF4 {...defaultProps} isChecked={false} />);
    expect(screen.getByRole('checkbox').checked).toBe(false);
  });

  it('respects isDisabled prop', () => {
    render(<SwitcherPF4 {...defaultProps} isDisabled />);
    expect(screen.getByRole('checkbox').disabled).toBe(true);
  });

  it('has the correct id format', () => {
    render(<SwitcherPF4 {...defaultProps} />);
    expect(screen.getByRole('checkbox').id).toBe('rh-cloud-switcher-test-id');
  });
});
