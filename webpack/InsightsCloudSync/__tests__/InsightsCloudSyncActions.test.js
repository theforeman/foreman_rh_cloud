import { post } from 'foremanReact/redux/API';
import { syncInsights } from '../InsightsCloudSyncActions';
import { INSIGHTS_CLOUD_SYNC } from '../InsightsCloudSyncConstants';

jest.mock('foremanReact/redux/API', () => ({
  post: jest.fn(action => action),
}));

jest.mock('../../common/ForemanTasks', () => ({
  setupTaskPolling: jest.fn(opts => ({ type: 'SETUP_TASK_POLLING', ...opts })),
  taskRelatedToast: jest.fn((id, type, msg) => ({
    type: 'TASK_TOAST',
    id,
    toastType: type,
    msg,
  })),
}));

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
    const postArg = post.mock.calls[0][0];
    expect(postArg.key).toBe(INSIGHTS_CLOUD_SYNC);
    expect(postArg.url).toBe('/insights_cloud/tasks');
    expect(typeof postArg.handleSuccess).toBe('function');
    expect(typeof postArg.errorToast).toBe('function');
  });

  it('errorToast returns failure message with error details', () => {
    syncInsights(jest.fn(), '')(dispatch);
    const postArg = post.mock.calls[0][0];

    const result = postArg.errorToast('some error');
    expect(result).toContain('some error');
  });
});
