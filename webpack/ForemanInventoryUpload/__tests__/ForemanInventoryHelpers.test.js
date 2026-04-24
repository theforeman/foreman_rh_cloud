import { isExitCodeLoading } from '../ForemanInventoryHelpers';

describe('ForemanInventoryUpload helpers', () => {
  describe('isExitCodeLoading', () => {
    it('returns true when exit code contains "running"', () => {
      expect(isExitCodeLoading('currently running')).toBe(true);
    });

    it('returns true when exit code contains "restarting"', () => {
      expect(isExitCodeLoading('restarting now')).toBe(true);
    });

    it('is case-insensitive', () => {
      expect(isExitCodeLoading('RUNNING')).toBe(true);
      expect(isExitCodeLoading('Restarting')).toBe(true);
    });

    it('returns false when exit code contains neither', () => {
      expect(isExitCodeLoading('exit 0')).toBe(false);
      expect(isExitCodeLoading('completed')).toBe(false);
    });
  });
});
