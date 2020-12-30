import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import SwitcherPF4 from '../SwitcherPF4';

const fixtures = {
  'should return insights cloud Url': {
    id: 'some-id',
    tooltip: 'some-text',
    label: 'some-label',
    onChange: jest.fn(),
  },
};

describe('InsightsCloudSync helpers', () =>
  testComponentSnapshotsWithFixtures(SwitcherPF4, fixtures));
