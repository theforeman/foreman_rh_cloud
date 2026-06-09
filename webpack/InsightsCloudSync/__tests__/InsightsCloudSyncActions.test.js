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
    expect(dispatched.key).toBe(INSIGHTS_CLOUD_SYNC);
    expect(dispatched.url).toBe('/insights_cloud/tasks');
    expect(typeof dispatched.handleSuccess).toBe('function');
    expect(typeof dispatched.errorToast).toBe('function');
  });

  it('errorToast returns failure message with error details', () => {
    syncInsights(jest.fn(), '')(dispatch);
    const dispatched = dispatch.mock.calls[0][0];

    const result = dispatched.errorToast('some error');
    expect(result).toContain('some error');
  });
});
