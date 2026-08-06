import {
  getIopAppRoute,
  getIopForemanPath,
  getIopIframeSrc,
} from '../iopIframeHelpers';

describe('iopIframeHelpers', () => {
  const options = {
    routePrefix: '/foreman_rh_cloud/insights_example',
    fallbackRoute: 'dashboard',
  };

  describe('getIopAppRoute', () => {
    it('maps foreman paths under the prefix to app routes', () => {
      expect(
        getIopAppRoute('/foreman_rh_cloud/insights_example/dashboard', options)
      ).toBe('dashboard');
      expect(
        getIopAppRoute(
          '/foreman_rh_cloud/insights_example/cves/cve-1',
          options
        )
      ).toBe('cves/cve-1');
    });

    it('returns fallbackRoute for paths outside the prefix', () => {
      expect(getIopAppRoute('/foreman_rh_cloud/other', options)).toBe(
        'dashboard'
      );
    });

    it('returns fallbackRoute when pathname is only the prefix', () => {
      expect(getIopAppRoute('/foreman_rh_cloud/insights_example', options)).toBe(
        'dashboard'
      );
      expect(
        getIopAppRoute('/foreman_rh_cloud/insights_example/', options)
      ).toBe('dashboard');
    });
  });

  describe('getIopForemanPath', () => {
    it('maps app routes to foreman paths', () => {
      expect(getIopForemanPath('dashboard', options)).toBe(
        '/foreman_rh_cloud/insights_example/dashboard'
      );
      expect(getIopForemanPath('cves/cve-1', options)).toBe(
        '/foreman_rh_cloud/insights_example/cves/cve-1'
      );
    });

    it('uses fallbackRoute when appRoute is empty', () => {
      expect(getIopForemanPath('', options)).toBe(
        '/foreman_rh_cloud/insights_example/dashboard'
      );
    });
  });

  describe('getIopIframeSrc', () => {
    it('returns origin + static app path', () => {
      expect(getIopIframeSrc('/assets/apps/example/index.html')).toBe(
        `${window.location.origin}/assets/apps/example/index.html`
      );
    });
  });
});
