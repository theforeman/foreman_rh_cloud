import React from 'react';
import { render } from '@testing-library/react';
import StatusChart from '../StatusChart';

jest.mock('patternfly-react', () => ({
  Grid: { Col: ({ children }) => <div>{children}</div> },
  DonutChart: ({ title }) => (
    <div data-testid="donut-chart">
      <span>{title?.primary}</span>
      <span>{title?.secondary}</span>
    </div>
  ),
}));

describe('StatusChart', () => {
  it('renders the status chart container', () => {
    const { container } = render(<StatusChart />);
    expect(container.querySelector('.status-chart')).toBeTruthy();
  });

  it('passes the completed percentage to the chart', () => {
    const { getByText } = render(<StatusChart completed={75} />);
    expect(getByText('75%')).toBeTruthy();
  });

  it('shows Completed label', () => {
    const { getByText } = render(<StatusChart completed={50} />);
    expect(getByText('Completed')).toBeTruthy();
  });
});
