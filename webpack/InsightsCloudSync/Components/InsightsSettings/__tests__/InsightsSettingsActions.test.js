import { API } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import {
  getInsightsSyncSettings,
  setInsightsSyncEnabled,
} from '../InsightsSettingsActions';
import {
  INSIGHTS_SYNC_SETTING_SET,
  INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
} from '../InsightsSettingsConstants';

jest.mock('foremanReact/redux/API');
jest.mock('foremanReact/components/ToastsList', () => ({
  addToast: jest.fn(opts => ({ type: 'ADD_TOAST', payload: opts })),
}));

describe('InsightsSettings actions', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.clearAllMocks();
  });

  describe('getInsightsSyncSettings', () => {
    it('dispatches success action with settings on success', async () => {
      API.get.mockResolvedValue({ data: { insightsSyncEnabled: true } });

      await getInsightsSyncSettings()(dispatch);

      expect(API.get).toHaveBeenCalledWith('/insights_cloud/settings');
      expect(dispatch).toHaveBeenCalledWith({
        type: INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
        payload: { settings: { insightsSyncEnabled: true } },
      });
    });

    it('dispatches error toast on failure', async () => {
      API.get.mockRejectedValue(new Error('Network error!'));

      await getInsightsSyncSettings()(dispatch);

      expect(addToast).toHaveBeenCalledWith({
        sticky: true,
        type: 'error',
        message: 'Network error!',
      });
    });
  });

  describe('setInsightsSyncEnabled', () => {
    it('dispatches setting set action on success', async () => {
      API.patch.mockResolvedValue({ data: { insightsSyncEnabled: true } });

      await setInsightsSyncEnabled(true)(dispatch);

      expect(API.patch).toHaveBeenCalledWith('/insights_cloud/settings', {
        insightsSyncEnabled: true,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: INSIGHTS_SYNC_SETTING_SET,
        payload: { settings: { insightsSyncEnabled: true } },
      });
    });

    it('dispatches error toast on failure', async () => {
      API.patch.mockRejectedValue(new Error('Network error!'));

      await setInsightsSyncEnabled(true)(dispatch);

      expect(addToast).toHaveBeenCalledWith({
        sticky: true,
        type: 'error',
        message: 'Network error!',
      });
    });
  });
});
