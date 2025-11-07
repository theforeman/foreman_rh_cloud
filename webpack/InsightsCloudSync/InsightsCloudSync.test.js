import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { noop } from 'foremanReact/common/helpers';
import InsightsCloudSync from './InsightsCloudSync';

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      foreman_rh_cloud: {
        iop: true,
      },
    },
  }),
}));

jest.mock('foremanReact/components/PF4/TableIndexPage/Table/TableHooks', () => ({
  useBulkSelect: () => ({
    selectedCount: 0,
    selectAll: noop,
    selectNone: noop,
    selectOne: noop,
    isSelected: () => false,
    selectedResults: [],
  }),
}));

describe('InsightsCloudSync', () => {
  it('should render with props', () => {
    const { container } = render(
      <InsightsCloudSync
        status="RESOLVED"
        syncInsights={noop}
        fetchInsights={noop}
        query=""
      />
    );
    expect(container.querySelector('.insights-cloud-sync')).toBeInTheDocument();
  });
});
