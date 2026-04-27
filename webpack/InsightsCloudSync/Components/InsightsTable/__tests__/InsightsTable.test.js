import React from 'react';
import { render, screen } from '@testing-library/react';
import InsightsTable from '../InsightsTable';
import { tableProps } from './fixtures';

jest.mock('../../../../common/Hooks/ConfigHooks');

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanSettings: () => ({ perPage: 20 }),
}));

jest.mock('../Pagination', () => () => null);

const buildProps = (overrides = {}) => ({
  ...tableProps,
  fetchInsights: jest.fn(),
  onTableSort: jest.fn(),
  onTableSelect: jest.fn(),
  selectAll: jest.fn(),
  clearAllSelection: jest.fn(),
  ...overrides,
});

describe('InsightsTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchInsights on mount', () => {
    const props = buildProps();
    render(<InsightsTable {...props} />);

    expect(props.fetchInsights).toHaveBeenCalledTimes(1);
    expect(props.fetchInsights).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, perPage: 5 })
    );
  });

  it('renders table with correct aria-label', () => {
    const props = buildProps();
    render(<InsightsTable {...props} />);

    expect(
      screen.getByRole('grid', { name: /Recommendations Table/ })
    ).toBeTruthy();
  });

  it('re-fetches when hostname changes', () => {
    const props = buildProps({ hostname: 'host1.example.com' });
    const { rerender } = render(<InsightsTable {...props} />);

    props.fetchInsights.mockClear();
    rerender(
      <InsightsTable {...props} hostname="host2.example.com" />
    );

    expect(props.fetchInsights).toHaveBeenCalledTimes(1);
  });

  it('renders with empty hits', () => {
    const props = buildProps({ hits: [], status: 'RESOLVED' });
    const { container } = render(<InsightsTable {...props} />);

    expect(container.querySelector('.rh-cloud-recommendations-table')).toBeTruthy();
  });
});
