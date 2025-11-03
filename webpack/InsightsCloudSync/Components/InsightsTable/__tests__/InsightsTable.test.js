import React from 'react';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
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

const { renderWithStore } = rtlHelpers;

const fixtures = {
  'render with Props': tableProps,
};

describe('InsightsTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithStore(<InsightsTable {...tableProps} />);
  });
});
