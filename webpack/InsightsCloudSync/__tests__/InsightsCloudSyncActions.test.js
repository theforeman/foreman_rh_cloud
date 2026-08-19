import { API_OPERATIONS } from 'foremanReact/redux/API';
import { syncInsights } from '../InsightsCloudSyncActions';
import { INSIGHTS_CLOUD_SYNC } from '../InsightsCloudSyncConstants';

jest.mock('../../common/ForemanTasks');

describe('InsightsCloudSync actions', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.clearAllMocks();
  });

  it('dispatches post with correct key and url', () => {
    const fetchInsights = jest.fn();
    syncInsights(fetchInsights, 'test-query')(dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    const dispatched = dispatch.mock.calls[0][0];
    expect(dispatched.type).toBe(API_OPERATIONS.POST);
    expect(dispatched.payload.key).toBe(INSIGHTS_CLOUD_SYNC);
    expect(dispatched.payload.url).toBe('/insights_cloud/tasks');
    expect(typeof dispatched.payload.handleSuccess).toBe('function');
    expect(typeof dispatched.payload.errorToast).toBe('function');
  });

  it('errorToast returns failure message with error details', () => {
    syncInsights(jest.fn(), '')(dispatch);
    const dispatched = dispatch.mock.calls[0][0];

    const result = dispatched.payload.errorToast('some error');
    expect(result).toContain('some error');
  });
});
