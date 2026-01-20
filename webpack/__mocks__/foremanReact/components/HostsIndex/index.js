import React from 'react';

export const ForemanHostsIndexActionsBarContext = React.createContext({
  fetchBulkParams: jest.fn(() => ''),
  selectedCount: 0,
  selectAllMode: false,
  setMenuOpen: jest.fn(),
});
