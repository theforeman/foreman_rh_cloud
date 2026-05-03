import React from 'react';
import { render, screen } from '@testing-library/react';
import InsightsTab from '../InsightsTab';
import { hits, hostID } from './InsightsTab.fixtures';

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

  it('displays hit titles', () => {
    render(<InsightsTab hostID={hostID} hits={hits} />);
    hits.forEach(hit => {
      expect(screen.getByText(hit.title)).toBeTruthy();
    });
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
    const titles = screen.getAllByText(/risk/i).map(el => el.textContent);
    const highRiskIndex = titles.findIndex(t => t === 'High risk');
    const mediumRiskIndex = titles.findIndex(t => t === 'Medium risk');
    const lowRiskIndex = titles.findIndex(t => t === 'Low risk');
    expect(highRiskIndex).toBeLessThan(mediumRiskIndex);
    expect(mediumRiskIndex).toBeLessThan(lowRiskIndex);
  });
});
