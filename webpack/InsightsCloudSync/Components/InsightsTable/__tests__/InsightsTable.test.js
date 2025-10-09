import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InsightsTable from '../InsightsTable';
import { tableProps } from './fixtures';

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      foreman_rh_cloud: {
        iop: true,
      },
    },
  }),
  useForemanSettings: () => ({
    perPage: 20,
  }),
}));

const fixtures = {
  'render with Props': tableProps,
};

describe('InsightsTable', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InsightsTable, fixtures));
});
