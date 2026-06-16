import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactRedux from 'react-redux';
import ToolbarButtons from '../ToolbarButtons';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock(
  '../../SyncButton',
  () =>
    function MockSyncButton() {
      return <div data-testid="sync-button">Sync all inventory status</div>;
    }
);

describe('ToolbarButtons', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders sync button when subscription connection is enabled', () => {
    reactRedux.useSelector.mockReturnValue(true);

    render(<ToolbarButtons />);

    expect(screen.getByTestId('sync-button')).toBeInTheDocument();
  });

  test('renders nothing when subscription connection is not enabled', () => {
    reactRedux.useSelector.mockReturnValue(false);

    const { container } = render(<ToolbarButtons />);

    expect(container.firstChild).toBeNull();
  });

  test('renders toolbar buttons container with correct className when enabled', () => {
    reactRedux.useSelector.mockReturnValue(true);

    const { container } = render(<ToolbarButtons />);

    expect(
      container.querySelector('.inventory_toolbar_buttons')
    ).toBeInTheDocument();
  });
});
