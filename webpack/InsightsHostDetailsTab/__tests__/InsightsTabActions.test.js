import { API } from 'foremanReact/redux/API';
import { fetchHits } from '../InsightsTabActions';
import { hostID, hits } from './InsightsTab.fixtures';
import {
  INSIGHTS_HITS_REQUEST,
  INSIGHTS_HITS_SUCCESS,
  INSIGHTS_HITS_FAILURE,
} from '../InsightsTabConstants';

jest.mock('foremanReact/redux/API');

describe('InsightsTab actions', () => {
  it('should fetchHits', async () => {
    API.get.mockImplementation(async () => ({ data: { hits } }));
    const dispatch = jest.fn();

    await fetchHits(hostID)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: INSIGHTS_HITS_REQUEST,
      })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: INSIGHTS_HITS_SUCCESS,
        payload: { hits },
      })
    );
  });

  it('should fetchHits with error', async () => {
    API.get.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error!'))
    );
    const dispatch = jest.fn();

    await fetchHits(hostID)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: INSIGHTS_HITS_REQUEST,
      })
    );
    // Error handling dispatches a toast notification, not INSIGHTS_HITS_FAILURE
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'TOASTS_ADD',
      })
    );
  });
});
