import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import NewHostDetailsTab from '../NewHostDetailsTab';

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

jest.mock('../../common/Hooks/ConfigHooks', () => ({
  useIopConfig: jest.fn(() => false),
}));

jest.mock('foremanReact/common/I18n', () => ({
  translate: jest.fn(str => str),
}));

jest.mock(
  'foremanReact/components/SearchBar',
  () => () => <div>SearchBar</div>,
  { virtual: true }
);

jest.mock('../../InsightsCloudSync/Components/InsightsTable', () => () => (
  <div>InsightsTable</div>
));

jest.mock('../../InsightsCloudSync/Components/RemediationModal', () => () => (
  <div>RemediationModal</div>
));

jest.mock(
  '../../InsightsCloudSync/Components/InsightsTable/Pagination',
  () => () => <div>Pagination</div>
);

const mockStore = configureMockStore([thunk]);

const defaultResponse = {
  id: 1,
  operatingsystem_name: 'Red Hat Enterprise Linux 8',
  insights_attributes: { uuid: 'test-uuid' },
};

describe('NewHostDetailsTab', () => {
  let store;
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      location: {
        pathname: '/new/hosts/test-host.example.com',
        search: '?page=1&per_page=20',
        hash: '#/Insights',
        query: { page: '1', per_page: '20' },
      },
    };

    store = mockStore({
      API: {},
      ForemanRhCloud: {
        InsightsCloudSync: {
          table: {
            selectedIds: {},
            isAllSelected: false,
            showSelectAllAlert: false,
          },
        },
      },
      insightsHostDetailsTab: {
        query: '',
        hits: [],
        selectedIds: {},
        error: null,
      },
      router: {
        location: {
          pathname: '/new/hosts/test-host.example.com',
          search: '?page=1&per_page=20',
          hash: '#/Insights',
          query: { page: '1', per_page: '20' },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cleanup effect', () => {
    it('should preserve hash when clearing search params on unmount', () => {
      const { unmount } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              router={mockRouter}
              response={defaultResponse}
            />
          </MemoryRouter>
        </Provider>
      );

      unmount();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        search: null,
        hash: '#/Insights',
      });
    });

    it('should only clear search params when no hash exists', () => {
      mockRouter.location.hash = '';

      const { unmount } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              router={mockRouter}
              response={defaultResponse}
            />
          </MemoryRouter>
        </Provider>
      );

      unmount();

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
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              router={routerWithoutLocation}
              response={defaultResponse}
            />
          </MemoryRouter>
        </Provider>
      );

      unmount();

      expect(routerWithoutLocation.replace).toHaveBeenCalledWith({
        search: null,
      });
    });

    it('should use the latest hash value at unmount time, not a stale captured value', () => {
      const { unmount } = render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              router={mockRouter}
              response={defaultResponse}
            />
          </MemoryRouter>
        </Provider>
      );

      mockRouter.location.hash = '#/Overview';

      unmount();

      expect(mockRouter.replace).toHaveBeenCalledWith({
        search: null,
        hash: '#/Overview',
      });
    });
  });

  describe('tab visibility', () => {
    it('should redirect to Overview when host is not RHEL', () => {
      const nonRhelResponse = {
        id: 2,
        operatingsystem_name: 'Ubuntu 20.04',
        insights_attributes: { uuid: 'test-uuid' },
      };

      render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              response={nonRhelResponse}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(mockHistoryReplace).toHaveBeenCalledWith('/Overview');
    });

    it('should redirect to Overview when insights facet is missing', () => {
      const responseWithoutInsights = {
        id: 3,
        operatingsystem_name: 'Red Hat Enterprise Linux 8',
      };

      render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              response={responseWithoutInsights}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(mockHistoryReplace).toHaveBeenCalledWith('/Overview');
    });

    it('should not redirect when host is valid RHEL with insights facet', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab
              hostName="test-host.example.com"
              response={defaultResponse}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(mockHistoryReplace).not.toHaveBeenCalledWith('/Overview');
    });

    it('should not redirect when host data is not yet loaded', () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <NewHostDetailsTab hostName="test-host.example.com" response={{}} />
          </MemoryRouter>
        </Provider>
      );

      expect(mockHistoryReplace).not.toHaveBeenCalledWith('/Overview');
    });
  });
});
