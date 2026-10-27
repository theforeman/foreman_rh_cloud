import React from 'react';
import { render, screen } from '@testing-library/react';
import InventoryAutoUpload from '../InventoryAutoUpload';

let mockIsIop = false;
jest.mock('../../../common/Hooks/ConfigHooks', () => ({
  useIopConfig: () => mockIsIop,
}));

jest.mock(
  '../../../Components/InventorySettings/InventorySettings',
  () => () => <div data-testid="inventory-settings">InventorySettings</div>
);

describe('InventoryAutoUpload', () => {
  const buildProps = (overrides = {}) => ({
    autoUploadEnabled: true,
    setSetting: jest.fn(),
    getSettings: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    mockIsIop = false;
  });

  it('renders the heading', () => {
    render(<InventoryAutoUpload {...buildProps()} />);
    expect(screen.getByText('Red Hat Cloud Inventory')).toBeTruthy();
  });

  it('renders the auto upload switcher', () => {
    render(<InventoryAutoUpload {...buildProps()} />);
    expect(
      screen.getByRole('checkbox', { name: /Inventory Auto Upload/ })
    ).toBeTruthy();
  });

  it('renders the advanced settings button', () => {
    render(<InventoryAutoUpload {...buildProps()} />);
    expect(
      screen.getByRole('button', { name: /Show Advanced Settings/ })
    ).toBeTruthy();
  });

  it('calls getSettings on mount', () => {
    const props = buildProps();
    render(<InventoryAutoUpload {...props} />);
    expect(props.getSettings).toHaveBeenCalled();
  });

  it('points to the Insights menu in regular mode', () => {
    mockIsIop = false;
    render(<InventoryAutoUpload {...buildProps()} />);
    expect(screen.getByText(/Insights/)).toBeTruthy();
    expect(screen.queryByText(/Administer/)).toBeNull();
  });

  it('points to the Administer menu in IoP mode', () => {
    mockIsIop = true;
    render(<InventoryAutoUpload {...buildProps()} />);
    expect(screen.getByText(/Administer/)).toBeTruthy();
    expect(screen.queryByText(/Insights/)).toBeNull();
  });
});
