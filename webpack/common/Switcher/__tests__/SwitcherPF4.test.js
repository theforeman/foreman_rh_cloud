import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitcherPF4 from '../SwitcherPF4';

describe('SwitcherPF4', () => {
  const buildProps = (overrides = {}) => ({
    id: 'test-id',
    label: 'Test Label',
    tooltip: 'Test tooltip',
    onChange: jest.fn(),
    ...overrides,
  });

  it('renders the switch', () => {
    render(<SwitcherPF4 {...buildProps()} />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('renders the label text', () => {
    render(<SwitcherPF4 {...buildProps()} />);
    expect(screen.getAllByText('Test Label').length).toBeGreaterThan(0);
  });

  it('is checked by default', () => {
    render(<SwitcherPF4 {...buildProps()} />);
    expect(screen.getByRole('checkbox').checked).toBe(true);
  });

  it('respects isChecked prop', () => {
    render(<SwitcherPF4 {...buildProps({ isChecked: false })} />);
    expect(screen.getByRole('checkbox').checked).toBe(false);
  });

  it('respects isDisabled prop', () => {
    render(<SwitcherPF4 {...buildProps({ isDisabled: true })} />);
    expect(screen.getByRole('checkbox').disabled).toBe(true);
  });

  it('calls onChange when toggled', () => {
    const onChange = jest.fn();
    render(<SwitcherPF4 {...buildProps({ onChange })} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
