import { foremanUrl, vulnerabilityDisabled, hasNoInsightsFacet } from '../ForemanRhCloudHelpers';

global.URL_PREFIX = 'MY_TEST_URL_PREFIX.example.com';

describe('ForemanRhCloud helpers', () => {
  it('should return foreman Url', () => {
    expect(foremanUrl('/test_path')).toBe('MY_TEST_URL_PREFIX.example.com/test_path');
  });

  it('vulnerabilityDisabled returns false for RHEL host with vulnerability enabled', () => {
    expect(vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Red Hat Enterprise Linux',
        vulnerability: { enabled: true },
      },
    })).toBe(false);
  });

  it('vulnerabilityDisabled returns true for non-RHEL host', () => {
    expect(vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Ubuntu',
        vulnerability: { enabled: true },
      },
    })).toBe(true);
  });

  it('vulnerabilityDisabled returns true for RHEL host with vulnerability disabled', () => {
    expect(vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Red Hat Enterprise Linux',
        vulnerability: { enabled: false },
      },
    })).toBe(true);
  });

  it('vulnerabilityDisabled returns true for missing vulnerability object', () => {
    expect(vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Red Hat Enterprise Linux',
      },
    })).toBe(true);
  });

  it('vulnerabilityDisabled returns true for missing hostDetails', () => {
    expect(vulnerabilityDisabled({})).toBe(true);
  });

  it('hasNoInsightsFacet returns false when insights_attributes is present', () => {
    expect(hasNoInsightsFacet({
      response: {
        insights_attributes: {
          uuid: 'test-uuid',
          insights_hits_count: 5,
        },
      },
    })).toBe(false);
  });

  it('hasNoInsightsFacet returns true when insights_attributes is missing', () => {
    expect(hasNoInsightsFacet({
      response: {},
    })).toBe(true);
  });

  it('hasNoInsightsFacet returns true when response is missing', () => {
    expect(hasNoInsightsFacet({})).toBe(true);
  });
});
