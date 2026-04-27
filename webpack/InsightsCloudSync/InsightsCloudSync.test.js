import React from 'react';
import { render, screen } from '@testing-library/react';
import RecommendationsPage from './InsightsCloudSync';

let mockIsIop = false;
jest.mock('../common/Hooks/ConfigHooks', () => ({
  useIopConfig: () => mockIsIop,
}));

jest.mock('../common/Hooks/PermissionsHooks', () => ({
  useInsightsPermissions: () => ({}),
}));

jest.mock('./Components/InsightsTable', () => () => (
  <div data-testid="insights-table" />
));
jest.mock('./Components/RemediationModal', () => () => (
  <div data-testid="remediation-modal" />
));
jest.mock('./Components/ToolbarDropdown', () => () => (
  <div data-testid="toolbar-dropdown" />
));
jest.mock('./Components/InsightsTable/Pagination', () => () => null);
jest.mock('./Components/InsightsSettings', () => () => (
  <div data-testid="insights-settings" />
));
jest.mock('foremanReact/routes/common/PageLayout/PageLayout', () => ({
  children,
  header,
  toolbarButtons,
}) => (
  <div data-testid="page-layout" data-header={header}>
    {toolbarButtons}
    {children}
  </div>
));
jest.mock('@scalprum/react-core', () => ({
  ScalprumComponent: props => <div data-testid="scalprum-component" />,
  ScalprumProvider: ({ children }) => <div>{children}</div>,
}));
jest.mock('../common/ScalprumModule/ScalprumContext', () => ({
  createProviderOptions: () => ({ config: {} }),
}));

const defaultProps = {
  syncInsights: jest.fn(),
  fetchInsights: jest.fn(),
  query: '',
};

describe('RecommendationsPage', () => {
  afterEach(() => {
    mockIsIop = false;
    jest.clearAllMocks();
  });

  describe('non-IOP mode', () => {
    it('renders page layout with child components', () => {
      render(<RecommendationsPage {...defaultProps} />);

      expect(screen.getByTestId('page-layout')).toBeTruthy();
      expect(screen.getByTestId('insights-table')).toBeTruthy();
      expect(screen.getByTestId('insights-settings')).toBeTruthy();
      expect(screen.getByTestId('remediation-modal')).toBeTruthy();
      expect(screen.getByTestId('toolbar-dropdown')).toBeTruthy();
    });

    it('has the rh-cloud-insights CSS class', () => {
      const { container } = render(
        <RecommendationsPage {...defaultProps} />
      );

      expect(container.querySelector('.rh-cloud-insights')).toBeTruthy();
    });

    it('sets page header to Red Hat Insights', () => {
      render(<RecommendationsPage {...defaultProps} />);

      expect(
        screen.getByTestId('page-layout').getAttribute('data-header')
      ).toBe('Red Hat Insights');
    });

    it('does not render Scalprum component', () => {
      render(<RecommendationsPage {...defaultProps} />);

      expect(screen.queryByTestId('scalprum-component')).toBeNull();
    });
  });

  describe('IOP mode', () => {
    beforeEach(() => {
      mockIsIop = true;
    });

    it('renders Scalprum component instead of page layout', () => {
      render(<RecommendationsPage {...defaultProps} />);

      expect(screen.getByTestId('scalprum-component')).toBeTruthy();
      expect(screen.queryByTestId('page-layout')).toBeNull();
    });
  });
});
