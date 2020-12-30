import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { HelpLabel } from '../HelpLabel';

const fixtures = {
  'should return insights cloud Url': {
    id: 'some-id',
    text: 'some-text',
    className: 'some-class',
  },
};

describe('InsightsCloudSync helpers', () =>
  testComponentSnapshotsWithFixtures(HelpLabel, fixtures));
