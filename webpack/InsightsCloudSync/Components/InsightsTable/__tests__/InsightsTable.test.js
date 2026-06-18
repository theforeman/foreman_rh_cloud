import React from 'react';
import Immutable from 'seamless-immutable';
import { fireEvent, render, screen } from '@testing-library/react';
import { SortByDirection } from '@patternfly/react-table';
import InsightsTable from '../InsightsTable';
import { tableProps } from './fixtures';

jest.mock('../../../../common/Hooks/ConfigHooks');
jest.mock('foremanReact/Root/Context/ForemanContext');
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

const selectableHits = Immutable([
  {
    id: 16,
    hostname: 'foo.example.com',
    title: 'Decreased security: Yum GPG verification disabled',
    total_risk: 1,
    has_playbook: true,
    results_url: 'https://cloud.redhat.com/foo',
    solution_url: '',
  },
  {
    id: 17,
    hostname: 'bar.example.com',
    title: 'Installation of packages across major releases is not supported',
    total_risk: 2,
    has_playbook: false,
    results_url: 'https://cloud.redhat.com/bar',
    solution_url: 'https://access.redhat.com/node/54483',
  },
  {
    id: 18,
    hostname: 'baz.example.com',
    title: 'Kernel package is old',
    total_risk: 3,
    has_playbook: true,
    results_url: 'https://cloud.redhat.com/baz',
    solution_url: '',
  },
]);

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

    expect(screen.getByLabelText(/Recommendations Table/)).toBeTruthy();
  });

  it('re-fetches when hostname changes', () => {
    const props = buildProps({ hostname: 'host1.example.com' });
    const { rerender } = render(<InsightsTable {...props} />);

    props.fetchInsights.mockClear();
    rerender(<InsightsTable {...props} hostname="host2.example.com" />);

    expect(props.fetchInsights).toHaveBeenCalledTimes(1);
  });

  it('renders with empty hits', () => {
    const props = buildProps({ hits: [], status: 'RESOLVED' });
    const { container } = render(<InsightsTable {...props} />);

    expect(
      container.querySelector('.rh-cloud-recommendations-table')
    ).toBeTruthy();
  });

  it('selects all enabled rows via header checkbox', () => {
    const props = buildProps({ hits: selectableHits, selectedIds: {} });
    render(<InsightsTable {...props} />);

    const headerCheckbox = screen.getByLabelText(/Select all rows/i);
    fireEvent.click(headerCheckbox);

    expect(props.onTableSelect).toHaveBeenCalledTimes(1);
    const [
      isSelected,
      rowId,
      rowsArg,
      selectedIdsArg,
    ] = props.onTableSelect.mock.calls[0];

    expect(isSelected).toBe(true);
    expect(rowId).toBe(-1);
    expect(selectedIdsArg).toEqual({});
    expect(rowsArg).toHaveLength(selectableHits.length);
    expect(rowsArg.map(row => row.id)).toEqual(
      selectableHits.map(hit => hit.id)
    );

    const disabledRows = rowsArg.filter(row => row.disableCheckbox);
    expect(disabledRows).toHaveLength(1);
    expect(disabledRows[0].id).toBe(17);
    expect(disabledRows[0].selected).toBe(false);

    const enabledRows = rowsArg.filter(row => !row.disableCheckbox);
    expect(enabledRows).toHaveLength(2);
    enabledRows.forEach(row => {
      expect(row.selected).toBe(false);
    });
  });

  it('selects an individual row via row checkbox', () => {
    const props = buildProps({ hits: selectableHits, selectedIds: {} });
    render(<InsightsTable {...props} />);

    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    const firstSelectableCheckbox = rowCheckboxes.find(
      checkbox => !checkbox.disabled
    );
    expect(firstSelectableCheckbox).toBeTruthy();
    fireEvent.click(firstSelectableCheckbox);

    expect(props.onTableSelect).toHaveBeenCalledTimes(1);
    expect(props.onTableSelect).toHaveBeenCalledWith(
      true,
      0,
      expect.any(Array),
      {}
    );
  });

  it('renders disabled checkbox rows as disabled', () => {
    const props = buildProps({ hits: selectableHits, selectedIds: {} });
    render(<InsightsTable {...props} />);

    const checkboxes = screen.getAllByRole('checkbox');
    const rowCheckboxes = checkboxes.slice(1);
    const disabledRowCheckboxes = rowCheckboxes.filter(
      checkbox => checkbox.disabled
    );
    const enabledRowCheckboxes = rowCheckboxes.filter(
      checkbox => !checkbox.disabled
    );

    expect(disabledRowCheckboxes).toHaveLength(1);
    expect(enabledRowCheckboxes).toHaveLength(2);
  });

  it('reflects partial/all header checkbox state from selected ids', () => {
    const props = buildProps({
      hits: selectableHits,
      selectedIds: { 16: true },
    });
    const { rerender } = render(<InsightsTable {...props} />);

    let [headerCheckbox] = screen.getAllByRole('checkbox');
    expect(headerCheckbox.checked).toBe(false);

    rerender(<InsightsTable {...props} selectedIds={{ 16: true, 18: true }} />);
    [headerCheckbox] = screen.getAllByRole('checkbox');
    expect(headerCheckbox.checked).toBe(true);
  });

  it('passes normalized sort index when selection column is present', () => {
    const props = buildProps({
      hits: selectableHits,
      sortBy: '',
      sortOrder: SortByDirection.asc,
    });
    render(<InsightsTable {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /Recommendation/i }));

    expect(props.onTableSort).toHaveBeenCalledTimes(1);
    expect(props.onTableSort).toHaveBeenCalledWith(
      expect.any(Array),
      1,
      expect.stringMatching(/asc|desc/)
    );
  });

  it('passes base sort index when selection column is absent', () => {
    const props = buildProps({
      hits: Immutable([
        {
          id: 16,
          hostname: 'foo.example.com',
          title: 'Decreased security: Yum GPG verification disabled',
          total_risk: 1,
          has_playbook: false,
          results_url: 'https://cloud.redhat.com/foo',
          solution_url: '',
        },
      ]),
      sortBy: '',
      sortOrder: SortByDirection.asc,
    });
    render(<InsightsTable {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /Hostname/i }));

    expect(props.onTableSort).toHaveBeenCalledTimes(1);
    expect(props.onTableSort).toHaveBeenCalledWith(
      expect.any(Array),
      0,
      expect.stringMatching(/asc|desc/)
    );
  });

  it('does not trigger sort for non-sortable Actions column', () => {
    const props = buildProps({ hits: selectableHits });
    render(<InsightsTable {...props} />);

    const actionsHeader = screen.getByText(/Actions/i).closest('th');
    expect(actionsHeader).toBeTruthy();
    fireEvent.click(actionsHeader);

    expect(props.onTableSort).not.toHaveBeenCalled();
  });

  it('does not apply sort aria state for invalid sortOrder', () => {
    const props = buildProps({
      hits: selectableHits,
      sortBy: 'total_risk',
      sortOrder: 'INVALID_DIRECTION',
    });
    const { container } = render(<InsightsTable {...props} />);

    expect(container.querySelector('[aria-sort]')).toBeNull();
  });
});
