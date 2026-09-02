import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import { API } from 'foremanReact/redux/API';

import InsightsTab from '../index';
import reducers from '../../ForemanRhCloudReducers';
import { INSIGHTS_HITS_SUCCESS } from '../InsightsTabConstants';
import { hostID, hits } from './InsightsTab.fixtures';

const { renderWithI18n } = rtlHelpers;

jest.mock('foremanReact/redux/API');

const recommendationTitle =
  'New Ansible Engine packages are inaccessible when dedicated Ansible repo is not enabled';

const createTabStore = () =>
  createStore(combineReducers({ ...reducers }), applyMiddleware(thunk));

const renderConnectedTab = (store = createTabStore()) =>
  renderWithI18n(
    <Provider store={store}>
      <InsightsTab hostID={hostID} />
    </Provider>
  );

describe('InsightsTab integration test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests hits for the host and shows empty state when there are none', async () => {
    let resolveHits;
    API.get.mockReturnValue(
      new Promise(resolve => {
        resolveHits = resolve;
      })
    );

    const store = createTabStore();
    store.dispatch({
      type: INSIGHTS_HITS_SUCCESS,
      payload: { hits },
    });

    renderConnectedTab(store);

    expect(await screen.findByText(recommendationTitle)).toBeInTheDocument();

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith(`/insights_cloud/hits/${hostID}`);
    });

    resolveHits({ data: { hits: [] } });

    expect(
      await screen.findByRole('heading', {
        name: 'No recommendations were found for this host!',
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(recommendationTitle)).not.toBeInTheDocument();
  });

  it('shows recommendation titles from the hits API response', async () => {
    API.get.mockResolvedValue({ data: { hits } });

    renderConnectedTab();

    expect(await screen.findByText(recommendationTitle)).toBeInTheDocument();

    expect(API.get).toHaveBeenCalledWith(`/insights_cloud/hits/${hostID}`);
  });
});
