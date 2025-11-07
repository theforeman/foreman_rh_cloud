import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwitcherPF4 from '../SwitcherPF4';

describe('InsightsCloudSync helpers', () => {
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
});
