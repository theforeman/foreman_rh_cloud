import React from 'react';
import { screen } from '@testing-library/react';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import ToolbarButtons from '../ToolbarButtons';
import { useIopConfig } from '../../../../../../common/Hooks/ConfigHooks';
import { selectSubscriptionConnectionEnabled } from '../../../../InventorySettings/InventorySettingsSelectors';

// Mock the config hook
jest.mock('../../../../../../common/Hooks/ConfigHooks', () => ({
  useIopConfig: jest.fn(),
}));

// Mock the selector
jest.mock('../../../../InventorySettings/InventorySettingsSelectors', () => ({
  selectSubscriptionConnectionEnabled: jest.fn(),
}));

// Mock child components to isolate ToolbarButtons testing
jest.mock(
  '../../SyncButton',
  () =>
    function MockSyncButton() {
      return <div data-testid="sync-button">Sync all inventory status</div>;
    }
);
jest.mock(
  '../../CloudConnectorButton',
  () =>
    function MockCloudConnectorButton() {
      return (
        <div data-testid="cloud-connector-button">
          Configure cloud connector
        </div>
      );
    }
);

const { renderWithStore } = rtlHelpers;

describe('ToolbarButtons', () => {
  test('renders both buttons when subscription connection is enabled and not in IOP mode', () => {
    useIopConfig.mockReturnValue(false);
    selectSubscriptionConnectionEnabled.mockReturnValue(true);

    renderWithStore(<ToolbarButtons />);

    expect(screen.getByTestId('cloud-connector-button')).toBeTruthy();
    expect(screen.getByTestId('sync-button')).toBeTruthy();
  });

  test('renders only sync button when in IOP mode', () => {
    useIopConfig.mockReturnValue(true);
    selectSubscriptionConnectionEnabled.mockReturnValue(true);

    renderWithStore(<ToolbarButtons />);

    expect(screen.queryByTestId('cloud-connector-button')).toBeNull();
    expect(screen.getByTestId('sync-button')).toBeTruthy();
  });

  test('renders nothing when subscription connection is not enabled', () => {
    useIopConfig.mockReturnValue(false);
    selectSubscriptionConnectionEnabled.mockReturnValue(false);

    const { container } = renderWithStore(<ToolbarButtons />);

    expect(container.firstChild).toBeNull();
  });

  test('renders toolbar buttons container with correct className when enabled', () => {
    useIopConfig.mockReturnValue(false);
    selectSubscriptionConnectionEnabled.mockReturnValue(true);

    const { container } = renderWithStore(<ToolbarButtons />);

    expect(container.querySelector('.inventory_toolbar_buttons')).toBeTruthy();
  });
});
