import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ForemanYupana from './ForemanYupana';

const fixtures = {
  'render without Props': {},
};

describe('ForemanYupana', () =>
  testComponentSnapshotsWithFixtures(ForemanYupana, fixtures));
