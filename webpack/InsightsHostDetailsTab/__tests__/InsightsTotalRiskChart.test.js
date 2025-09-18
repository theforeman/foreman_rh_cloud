import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import { STATUS } from 'foremanReact/constants';
import * as APIHooks from 'foremanReact/common/hooks/API/APIHooks';
import InsightsTotalRiskCard from '../InsightsTotalRiskChart';

jest.mock('foremanReact/common/hooks/API/APIHooks');
jest.mock('foremanReact/common/I18n', () => ({
  translate: jest.fn(str => str),
}));

const mockStore = configureMockStore();
const history = createMemoryHistory();
const store = mockStore({
  router: {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
    },
    action: 'POP',
  },
});

const defaultHostDetails = {
  id: 1,
  insights_attributes: {
    uuid: 'test-uuid',
    use_iop_mode: false,
  },
};

const renderComponent = (props = {}) => {
  const allProps = {
    hostDetails: defaultHostDetails,
    ...props,
  };

  return render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <InsightsTotalRiskCard {...allProps} />
      </ConnectedRouter>
    </Provider>
  );
};

describe('InsightsTotalRiskChart', () => {
  beforeEach(() => {
    store.clearActions();
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    APIHooks.useAPI.mockReturnValue({
      status: STATUS.PENDING,
      response: null,
    });

    renderComponent();
    // SkeletonLoader shows loading state when status is PENDING
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('rh-cloud-total-risk-card')
    ).not.toBeInTheDocument();
  });

  it('should display error state when API fails', async () => {
    APIHooks.useAPI.mockReturnValue({
      status: STATUS.ERROR,
      response: null,
    });

    renderComponent();
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.queryByTestId('rh-cloud-total-risk-card')
    ).not.toBeInTheDocument();
  });

  it('should handle non-IoP mode API response correctly', async () => {
    const mockResponse = {
      hits: [
        { total_risk: 1 },
        { total_risk: 2 },
        { total_risk: 2 },
        { total_risk: 3 },
        { total_risk: 4 },
      ],
    };

    APIHooks.useAPI.mockReturnValue({
      status: STATUS.RESOLVED,
      response: mockResponse,
    });

    renderComponent();

    await waitFor(() => {
      // Check if total number of recommendations is displayed
      expect(screen.getByText('5')).toBeInTheDocument();
      // Check if risk levels are displayed correctly
      expect(screen.getByText(/Low: 1/)).toBeInTheDocument();
      expect(screen.getByText(/Moderate: 2/)).toBeInTheDocument();
      expect(screen.getByText(/Important: 1/)).toBeInTheDocument();
      expect(screen.getByText(/Critical: 1/)).toBeInTheDocument();
    });
  });

  it('should handle IOP mode API response correctly', async () => {
    const mockResponse = {
      low_hits: 2,
      moderate_hits: 3,
      important_hits: 1,
      critical_hits: 2,
      hits: 8,
    };

    APIHooks.useAPI.mockReturnValue({
      status: STATUS.RESOLVED,
      response: mockResponse,
    });

    renderComponent({
      hostDetails: {
        ...defaultHostDetails,
        insights_attributes: {
          ...defaultHostDetails.insights_attributes,
          use_iop_mode: true,
        },
      },
    });

    await waitFor(() => {
      // Check if total number of recommendations is displayed
      expect(screen.getByText('8')).toBeInTheDocument();
      // Check if risk levels are displayed correctly
      expect(screen.getByText(/Low: 2/)).toBeInTheDocument();
      expect(screen.getByText(/Moderate: 3/)).toBeInTheDocument();
      expect(screen.getByText(/Important: 1/)).toBeInTheDocument();
      expect(screen.getByText(/Critical: 2/)).toBeInTheDocument();
    });
  });

  it('should show empty state when no recommendations exist', async () => {
    APIHooks.useAPI.mockReturnValue({
      status: STATUS.RESOLVED,
      response: { hits: [] },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Low: 0/)).toBeInTheDocument();
      expect(screen.getByText(/Moderate: 0/)).toBeInTheDocument();
      expect(screen.getByText(/Important: 0/)).toBeInTheDocument();
      expect(screen.getByText(/Critical: 0/)).toBeInTheDocument();
    });
  });

  it('should use correct API endpoint based on IOP mode', () => {
    renderComponent({
      hostDetails: {
        ...defaultHostDetails,
        insights_attributes: {
          ...defaultHostDetails.insights_attributes,
          use_iop_mode: true,
        },
      },
    });

    expect(APIHooks.useAPI).toHaveBeenCalledWith(
      'get',
      expect.stringContaining('/api/insights/v1/system/test-uuid'),
      expect.any(Object)
    );

    jest.clearAllMocks();

    renderComponent();

    expect(APIHooks.useAPI).toHaveBeenCalledWith(
      'get',
      expect.stringContaining('/hits/1'),
      expect.any(Object)
    );
  });
});
