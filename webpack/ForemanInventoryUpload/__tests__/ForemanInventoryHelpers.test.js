import { getDocsURL } from 'foremanReact/common/helpers';
import {
  getInventoryDocsUrl,
  isExitCodeLoading,
} from '../ForemanInventoryHelpers';

jest.mock('foremanReact/common/helpers', () => ({
  getDocsURL: jest.fn(),
}));

describe('ForemanInventoryUpload helpers', () => {
  describe('getInventoryDocsUrl', () => {
    it('requests the Managing Hosts guide at the cloud connection chapter', () => {
      getInventoryDocsUrl();
      expect(getDocsURL).toHaveBeenCalledWith(
        'Managing_Hosts',
        'configuring-foreman-server-for-cloud-connection'
      );
    });
  });

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
