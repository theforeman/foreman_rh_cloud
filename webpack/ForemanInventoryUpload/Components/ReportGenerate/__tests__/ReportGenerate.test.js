import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import ReportGenerate from '../ReportGenerate';
import { props } from '../ReportGenerate.fixtures';

const fixtures = {
  'render without Props': {},
  'render with Props': props,
};

describe('ReportGenerate', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ReportGenerate, fixtures));
});
