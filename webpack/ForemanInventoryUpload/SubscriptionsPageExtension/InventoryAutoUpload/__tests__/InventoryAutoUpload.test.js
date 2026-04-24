import React from 'react';
import { render, screen } from '@testing-library/react';
import InventoryAutoUpload from '../InventoryAutoUpload';

jest.mock('../../../../common/Switcher', () => ({ label }) => (
  <div data-testid="switcher">{label}</div>
));
jest.mock(
  '../../../Components/InventorySettings/InventorySettings',
  () => () => <div data-testid="inventory-settings">InventorySettings</div>
);

describe('InventoryAutoUpload', () => {
  const defaultProps = {
    autoUploadEnabled: true,
    setSetting: jest.fn(),
    getSettings: jest.fn(),
  };

  it('renders the heading', () => {
    render(<InventoryAutoUpload {...defaultProps} />);
    expect(screen.getByText('Red Hat Cloud Inventory')).toBeTruthy();
  });

  it('renders the auto upload switcher', () => {
    render(<InventoryAutoUpload {...defaultProps} />);
    expect(screen.getByText('Inventory Auto Upload')).toBeTruthy();
  });

  it('renders the advanced settings button', () => {
    render(<InventoryAutoUpload {...defaultProps} />);
    expect(screen.getByText('Show Advanced Settings')).toBeTruthy();
  });

  it('calls getSettings on mount', () => {
    render(<InventoryAutoUpload {...defaultProps} />);
    expect(defaultProps.getSettings).toHaveBeenCalled();
  });
});
