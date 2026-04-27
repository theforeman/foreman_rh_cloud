import {
  foremanUrl,
  vulnerabilityDisabled,
  hasNoInsightsFacet,
} from '../ForemanRhCloudHelpers';

describe('ForemanRhCloud helpers', () => {
  describe('foremanUrl', () => {
    beforeAll(() => {
      global.URL_PREFIX = 'MY_TEST_URL_PREFIX.example.com';
    });

    it('prepends URL_PREFIX to path', () => {
      expect(foremanUrl('/test_path')).toBe(
        'MY_TEST_URL_PREFIX.example.com/test_path'
      );
    });
  });

  describe('vulnerabilityDisabled', () => {
    it('returns false for RHEL host with vulnerability enabled', () => {
      expect(
        vulnerabilityDisabled({
          hostDetails: {
            operatingsystem_name: 'Red Hat Enterprise Linux',
            vulnerability: { enabled: true },
          },
        })
      ).toBe(false);
    });

    it('returns true for non-RHEL host', () => {
      expect(
        vulnerabilityDisabled({
          hostDetails: {
            operatingsystem_name: 'Ubuntu',
            vulnerability: { enabled: true },
          },
        })
      ).toBe(true);
    });

    it('returns true for RHEL host with vulnerability disabled', () => {
      expect(
        vulnerabilityDisabled({
          hostDetails: {
            operatingsystem_name: 'Red Hat Enterprise Linux',
            vulnerability: { enabled: false },
          },
        })
      ).toBe(true);
    });

    it('returns true when vulnerability object is missing', () => {
      expect(
        vulnerabilityDisabled({
          hostDetails: {
            operatingsystem_name: 'Red Hat Enterprise Linux',
          },
        })
      ).toBe(true);
    });

    it('returns true when hostDetails is missing', () => {
      expect(vulnerabilityDisabled({})).toBe(true);
    });
  });

  describe('hasNoInsightsFacet', () => {
    it('returns false when insights_attributes is present in response', () => {
      expect(
        hasNoInsightsFacet({
          response: {
            insights_attributes: {
              uuid: 'test-uuid',
              insights_hits_count: 5,
            },
          },
        })
      ).toBe(false);
    });

    it('returns true when insights_attributes is missing from response', () => {
      expect(hasNoInsightsFacet({ response: {} })).toBe(true);
    });

    it('returns true when response is missing', () => {
      expect(hasNoInsightsFacet({})).toBe(true);
    });
  });
});
