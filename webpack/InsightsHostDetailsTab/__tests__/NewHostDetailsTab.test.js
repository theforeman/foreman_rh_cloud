import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import NewHostDetailsTab from '../NewHostDetailsTab';

jest.mock('../../common/Hooks/ConfigHooks', () => ({
  useIopConfig: jest.fn(() => false),
}));

jest.mock('foremanReact/common/I18n', () => ({
  translate: jest.fn(str => str),
}));

const mockStore = configureMockStore([thunk]);

describe('NewHostDetailsTab', () => {
  let store;
  let mockRouter;

  beforeEach(() => {
    store = mockStore({
      insightsHostDetailsTab: {
        query: '',
        hits: [],
        selectedIds: {},
        error: null,
      },
    });

    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      location: {
        pathname: '/new/hosts/test-host.example.com',
        search: '?page=1&per_page=20',
        hash: '#/Insights',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cleanup effect', () => {
    it('should preserve hash when clearing search params on unmount', () => {
      const { unmount } = render(
        <Provider store={store}>
          <NewHostDetailsTab
            hostName="test-host.example.com"
            router={mockRouter}
          />
        </Provider>
      );

      // Unmount the component to trigger cleanup
      unmount();

      // Verify router.replace was called with both search: null AND the existing hash
      expect(mockRouter.replace).toHaveBeenCalledWith({
        search: null,
        hash: '#/Insights',
      });
    });

    it('should only clear search params when no hash exists', () => {
      mockRouter.location.hash = '';

      const { unmount } = render(
        <Provider store={store}>
          <NewHostDetailsTab
            hostName="test-host.example.com"
            router={mockRouter}
          />
        </Provider>
      );

      unmount();

      // When there's no hash, should only pass search: null
      expect(mockRouter.replace).toHaveBeenCalledWith({
        search: null,
      });
    });

    it('should handle router.location being undefined gracefully', () => {
      const routerWithoutLocation = {
        push: jest.fn(),
        replace: jest.fn(),
        location: undefined,
      };

      const { unmount } = render(
        <Provider store={store}>
          <NewHostDetailsTab
            hostName="test-host.example.com"
            router={routerWithoutLocation}
          />
        </Provider>
      );

      unmount();

      // Should still call replace with search: null even if location is undefined
      expect(routerWithoutLocation.replace).toHaveBeenCalledWith({
        search: null,
      });
    });
  });
});
