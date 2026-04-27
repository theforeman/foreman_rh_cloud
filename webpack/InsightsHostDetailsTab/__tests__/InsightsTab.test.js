import React from 'react';
import { render, screen } from '@testing-library/react';
import InsightsTab from '../InsightsTab';
import { hits, hostID } from './InsightsTab.fixtures';

jest.mock('../components/ListItem', () =>
  // eslint-disable-next-line react/prop-types
  ({ title, totalRisk }) => (
    <div data-testid="list-item" data-risk={totalRisk}>
      {title}
    </div>
  )
);

describe('InsightsTab', () => {
  it('renders "No recommendations" message when hits is empty', () => {
    render(<InsightsTab hostID={hostID} hits={[]} />);
    expect(
      screen.getByText('No recommendations were found for this host!')
    ).toBeTruthy();
  });

  it('renders Recommendations heading when hits exist', () => {
    render(<InsightsTab hostID={hostID} hits={hits} />);
    expect(screen.getByText('Recommendations')).toBeTruthy();
  });

  it('renders list items for each hit', () => {
    render(<InsightsTab hostID={hostID} hits={hits} />);
    expect(screen.getAllByTestId('list-item')).toHaveLength(hits.length);
  });

  it('displays hit titles', () => {
    render(<InsightsTab hostID={hostID} hits={hits} />);
    expect(screen.getByText(hits[0].title)).toBeTruthy();
  });

  it('calls fetchHits on mount', () => {
    const fetchHits = jest.fn();
    render(<InsightsTab hostID={hostID} hits={[]} fetchHits={fetchHits} />);
    expect(fetchHits).toHaveBeenCalledWith(hostID);
  });

  it('sorts hits by total_risk descending', () => {
    const multipleHits = [
      { ...hits[0], title: 'Low risk', total_risk: 1 },
      { ...hits[0], title: 'High risk', total_risk: 4 },
      { ...hits[0], title: 'Medium risk', total_risk: 2 },
    ];
    render(<InsightsTab hostID={hostID} hits={multipleHits} />);
    const items = screen.getAllByTestId('list-item');
    expect(items[0].getAttribute('data-risk')).toBe('4');
    expect(items[1].getAttribute('data-risk')).toBe('2');
    expect(items[2].getAttribute('data-risk')).toBe('1');
  });
});
