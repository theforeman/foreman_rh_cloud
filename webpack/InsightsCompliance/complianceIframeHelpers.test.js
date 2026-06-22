import {
  getComplianceAppRoute,
  getComplianceForemanPath,
  getComplianceIframeSrc,
} from './complianceIframeHelpers';

describe('complianceIframeHelpers', () => {
  describe('getComplianceAppRoute', () => {
    it('maps foreman compliance paths to app routes', () => {
      expect(
        getComplianceAppRoute('/foreman_rh_cloud/insights_compliance/reports')
      ).toBe('reports');
      expect(
        getComplianceAppRoute(
          '/foreman_rh_cloud/insights_compliance/reports/report-1'
        )
      ).toBe('reports/report-1');
      expect(
        getComplianceAppRoute(
          '/foreman_rh_cloud/insights_compliance/scappolicies/new'
        )
      ).toBe('scappolicies/new');
    });

    it('defaults to reports for unknown paths', () => {
      expect(getComplianceAppRoute('/foreman_rh_cloud/insights_cloud')).toBe(
        'reports'
      );
    });
  });

  describe('getComplianceForemanPath', () => {
    it('maps app routes to foreman compliance paths', () => {
      expect(getComplianceForemanPath('reports')).toBe(
        '/foreman_rh_cloud/insights_compliance/reports'
      );
      expect(getComplianceForemanPath('scappolicies/new')).toBe(
        '/foreman_rh_cloud/insights_compliance/scappolicies/new'
      );
    });
  });

  describe('getComplianceIframeSrc', () => {
    it('returns the static compliance app entry', () => {
      expect(getComplianceIframeSrc()).toBe(
        `${window.location.origin}/assets/apps/compliance/index.html`
      );
    });
  });
});
