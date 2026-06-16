import React from 'react';
import { screen } from '@testing-library/react';
import { rtlHelpers } from 'foremanReact/common/rtlTestHelpers';
import PageHeader from '../PageHeader';

// Create a variable to control IoP mode in tests
let mockIopMode = false;

// Mock ForemanContext
jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      foreman_rh_cloud: {
        iop: mockIopMode,
      },
    },
    UI: {},
  }),
}));

// Mock child components to isolate PageHeader testing
// This prevents child component complexity from affecting our tests
jest.mock('../PageTitle', () => () => (
  <div data-testid="page-title">PageTitle</div>
));
jest.mock('../../InventorySettings', () => () => (
  <div data-testid="inventory-settings">InventorySettings</div>
));
jest.mock('../components/PageDescription', () => () => (
  <div data-testid="page-description">PageDescription</div>
));
jest.mock('../../InventoryFilter', () => () => (
  <div data-testid="inventory-filter">InventoryFilter</div>
));
jest.mock('../components/ToolbarButtons', () => () => (
  <div data-testid="toolbar-buttons">ToolbarButtons</div>
));

const { renderWithStore } = rtlHelpers;

describe('PageHeader', () => {
  describe('component behavior', () => {
    test('renders all components when not in IoP mode', () => {
      mockIopMode = false; // Ensure IoP mode is disabled for this test

      renderWithStore(<PageHeader />, {
        API: {
          INVENTORY_SETTINGS: {
            response: { subscriptionConnectionEnabled: true },
          },
          ADVISOR_ENGINE_CONFIG: {
            response: { use_iop_mode: false },
            status: 'RESOLVED',
          },
        },
      });

      // All components should be present when not in IoP mode
      expect(screen.getByTestId('page-title')).toBeTruthy();
      expect(screen.getByTestId('inventory-settings')).toBeTruthy();
      expect(screen.getByTestId('page-description')).toBeTruthy();
      expect(screen.getByTestId('inventory-filter')).toBeTruthy();
      expect(screen.getByTestId('toolbar-buttons')).toBeTruthy();
    });

    test('hides inventory settings and description when in IoP mode', () => {
      mockIopMode = true; // Enable IoP mode for this test

      renderWithStore(<PageHeader />, {
        API: {
          INVENTORY_SETTINGS: {
            response: { subscriptionConnectionEnabled: true },
          },
          ADVISOR_ENGINE_CONFIG: {
            response: { use_iop_mode: true },
            status: 'RESOLVED',
          },
        },
      });

      // Core components should still be present
      expect(screen.getByTestId('page-title')).toBeTruthy();
      expect(screen.getByTestId('inventory-filter')).toBeTruthy();
      expect(screen.getByTestId('toolbar-buttons')).toBeTruthy();

      // These components should be hidden in IoP mode
      expect(screen.queryByTestId('inventory-settings')).toBeNull();
      expect(screen.queryByTestId('page-description')).toBeNull();
    });

    test('renders with correct CSS class', () => {
      mockIopMode = false; // Ensure IoP mode is disabled for this test

      const { container } = renderWithStore(<PageHeader />, {
        API: {
          INVENTORY_SETTINGS: {
            response: { subscriptionConnectionEnabled: true },
          },
          ADVISOR_ENGINE_CONFIG: {
            response: { use_iop_mode: false },
            status: 'RESOLVED',
          },
        },
      });

      expect(container.querySelector('.inventory-upload-header')).toBeTruthy();
    });

    test('renders grid layout with correct structure', () => {
      mockIopMode = false; // Ensure IoP mode is disabled for this test

      const { container } = renderWithStore(<PageHeader />, {
        API: {
          INVENTORY_SETTINGS: {
            response: { subscriptionConnectionEnabled: true },
          },
          ADVISOR_ENGINE_CONFIG: {
            response: { use_iop_mode: false },
            status: 'RESOLVED',
          },
        },
      });

      const gridRow = container.querySelector('.row');
      expect(gridRow).toBeTruthy();

      const filterColumn = container.querySelector('.col-xs-4');
      expect(filterColumn).toBeTruthy();

      const toolbarColumn = container.querySelector('.col-xs-7');
      expect(toolbarColumn).toBeTruthy();
    });

    test('renders description section only when not in IoP mode', () => {
      mockIopMode = false; // Ensure IoP mode is disabled for this test

      const { container } = renderWithStore(<PageHeader />, {
        API: {
          INVENTORY_SETTINGS: {
            response: { subscriptionConnectionEnabled: true },
          },
          ADVISOR_ENGINE_CONFIG: {
            response: { use_iop_mode: false },
            status: 'RESOLVED',
          },
        },
      });

      // Description section should be present when not in IoP mode
      const descriptionSection = container.querySelector(
        '.inventory-upload-header-description'
      );
      expect(descriptionSection).toBeTruthy();
    });

    test('does not render description section when in IoP mode', () => {
      mockIopMode = true; // Enable IoP mode for this test

      const { container } = renderWithStore(<PageHeader />, {
        API: {
          INVENTORY_SETTINGS: {
            response: { subscriptionConnectionEnabled: true },
          },
          ADVISOR_ENGINE_CONFIG: {
            response: { use_iop_mode: true },
            status: 'RESOLVED',
          },
        },
      });

      // Description section should not be present in IoP mode
      const descriptionSection = container.querySelector(
        '.inventory-upload-header-description'
      );
      expect(descriptionSection).toBeNull();
    });
  });
});
