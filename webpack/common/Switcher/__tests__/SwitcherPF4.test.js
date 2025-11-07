import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwitcherPF4 from '../SwitcherPF4';

describe('SwitcherPF4', () => {
  it('should render with props', () => {
    render(
      <SwitcherPF4
        id="some-id"
        tooltip="some-text"
        label="some-label"
        onChange={jest.fn()}
      />
    );
    const labels = screen.getAllByText('some-label');
    expect(labels).toHaveLength(2); // One for "on" state, one for "off" state
    expect(labels[0]).toBeInTheDocument();
  });

  it('should call onChange when toggled', () => {
    const handleChange = jest.fn();
    render(
      <SwitcherPF4
        id="some-id"
        tooltip="some-text"
        label="some-label"
        onChange={handleChange}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <SwitcherPF4
        id="some-id"
        tooltip="some-text"
        label="some-label"
        onChange={jest.fn()}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'rh-cloud-switcher-some-id');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });
});
