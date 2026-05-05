import { selectTaskStatus } from '../SyncButtonSelectors';

const buildState = result => ({
  API: {
    INVENTORY_SYNC_TASK_UPDATE: {
      response: {
        result,
      },
    },
  },
});

describe('SyncButton selectors', () => {
  it('uppercases the result string', () => {
    expect(selectTaskStatus(buildState('pending'))).toBe('PENDING');
  });

  it('handles other result strings', () => {
    expect(selectTaskStatus(buildState('success'))).toBe('SUCCESS');
  });

  it('returns null when result is not a string', () => {
    expect(selectTaskStatus(buildState(null))).toBeNull();
  });

  it('returns null when result is undefined', () => {
    expect(selectTaskStatus(buildState(undefined))).toBeNull();
  });
});
