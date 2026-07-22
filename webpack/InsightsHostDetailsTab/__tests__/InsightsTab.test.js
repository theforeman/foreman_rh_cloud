import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import InsightsTab from '../InsightsTab';
import { hits, hostID, multipleHits } from './InsightsTab.fixtures';

const { renderWithI18n } = rtlHelpers;

const renderInsightsTab = (props = {}) =>
  renderWithI18n(
    <InsightsTab hostID={hostID} hits={[]} fetchHits={jest.fn()} {...props} />
  );

describe('InsightsTab', () => {
  it('renders empty state heading when there are no recommendations', async () => {
    renderInsightsTab({ hits: [] });

    expect(
      await screen.findByRole('heading', {
        name: 'No recommendations were found for this host!',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Recommendations' })
    ).not.toBeInTheDocument();
  });

  it('renders recommendations heading when hits exist', async () => {
    renderInsightsTab({ hits });

    expect(
      await screen.findByRole('heading', { name: 'Recommendations' })
    ).toBeInTheDocument();
  });

  it('displays recommendation titles in the list', async () => {
    renderInsightsTab({ hits });

    expect(
      await screen.findByText(
        'New Ansible Engine packages are inaccessible when dedicated Ansible repo is not enabled'
      )
    ).toBeInTheDocument();
  });

  it('requests recommendations for the host on mount', async () => {
    const fetchHits = jest.fn();

    renderInsightsTab({ hits: [], fetchHits });

    await waitFor(() => {
      expect(fetchHits).toHaveBeenCalledWith(hostID);
    });
  });

  it('sorts recommendations by total risk descending', async () => {
    renderInsightsTab({ hits: multipleHits });

    const hitsList = await screen.findByTestId('hits-list');
    const toggles = within(hitsList).getAllByRole('button');

    expect(toggles[0]).toHaveTextContent('High risk');
    expect(toggles[1]).toHaveTextContent('Medium risk');
    expect(toggles[2]).toHaveTextContent('Low risk');
  });
});
