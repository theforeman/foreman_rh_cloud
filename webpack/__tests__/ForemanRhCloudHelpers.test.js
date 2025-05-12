import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { foremanUrl, vulnerabilityDisabled } from '../ForemanRhCloudHelpers';

global.URL_PREFIX = 'MY_TEST_URL_PREFIX.example.com';

const fixtures = {
  'should return foreman Url': () => foremanUrl('/test_path'),
  'vulnerabilityDisabled returns false for RHEL host with vulnerability enabled': () =>
    vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Red Hat Enterprise Linux',
        vulnerability: { enabled: true },
      },
    }),
  'vulnerabilityDisabled returns true for non-RHEL host': () =>
    vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Ubuntu',
        vulnerability: { enabled: true },
      },
    }),
  'vulnerabilityDisabled returns true for RHEL host with vulnerability disabled': () =>
    vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Red Hat Enterprise Linux',
        vulnerability: { enabled: false },
      },
    }),
  'vulnerabilityDisabled returns true for missing vulnerability object': () =>
    vulnerabilityDisabled({
      hostDetails: {
        operatingsystem_name: 'Red Hat Enterprise Linux',
      },
    }),
  'vulnerabilityDisabled returns true for missing hostDetails': () =>
    vulnerabilityDisabled({}),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
