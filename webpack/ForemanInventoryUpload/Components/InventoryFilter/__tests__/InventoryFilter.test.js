import React from 'react';
import { render, screen } from '@testing-library/react';
import InventoryFilter from '../InventoryFilter';

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanOrganization: () => ({ title: 'Any Organization' }),
}));

describe('InventoryFilter', () => {
  it('renders the filter input', () => {
    render(<InventoryFilter />);
    expect(screen.getByPlaceholderText('Filter..')).toBeTruthy();
  });

  it('displays the current filter term', () => {
    render(<InventoryFilter filterTerm="test-filter" />);
    expect(screen.getByDisplayValue('test-filter')).toBeTruthy();
  });
});
