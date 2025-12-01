import React from 'react';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import InsightsTable from '../InsightsTable';
import { tableProps } from './fixtures';

jest.mock('../../../../common/Hooks/ConfigHooks');

const { renderWithStore } = rtlHelpers;

describe('InsightsTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithStore(<InsightsTable {...tableProps} />);
  });
});
