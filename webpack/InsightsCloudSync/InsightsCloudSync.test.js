import React from 'react';
import { render } from '@testing-library/react';
import RecommendationsPage from './InsightsCloudSync';

let mockIsIop = false;
jest.mock('../common/Hooks/ConfigHooks', () => ({
  useIopConfig: () => mockIsIop,
}));

jest.mock('../common/Hooks/PermissionsHooks', () => ({
  useInsightsPermissions: () => ({}),
}));

jest.mock('./Components/InsightsTable', () => () => null);
jest.mock('./Components/RemediationModal', () => () => null);
jest.mock('./Components/InsightsTable/Pagination', () => () => null);
jest.mock('./Components/InsightsSettings', () => () => null);
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
  ScalprumComponent: () => <div data-testid="scalprum-component" />,
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
    it('renders with rh-cloud-insights class and correct header', () => {
      const { container } = render(
        <RecommendationsPage {...defaultProps} />
      );

      expect(container.querySelector('.rh-cloud-insights')).toBeTruthy();
      expect(
        container.querySelector('[data-header="Red Hat Insights"]')
      ).toBeTruthy();
    });

    it('does not render IOP advisor view', () => {
      const { container } = render(
        <RecommendationsPage {...defaultProps} />
      );

      expect(container.querySelector('.advisor')).toBeNull();
    });
  });

  describe('IOP mode', () => {
    beforeEach(() => {
      mockIsIop = true;
    });

    it('renders advisor view instead of insights page', () => {
      const { container } = render(
        <RecommendationsPage {...defaultProps} />
      );

      expect(container.querySelector('.advisor')).toBeTruthy();
      expect(container.querySelector('.rh-cloud-insights')).toBeNull();
    });
  });
});
