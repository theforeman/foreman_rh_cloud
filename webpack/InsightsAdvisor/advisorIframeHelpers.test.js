import { getAdvisorAppRoute, getAdvisorForemanPath, getAdvisorIframeSrc } from './advisorIframeHelpers';

describe('Advisor iframe routing', () => {
  it('preserves legacy list, recommendation and pathway links', () => {
    expect(getAdvisorAppRoute('/foreman_rh_cloud/insights_cloud?limit=20')).toBe('recommendations?limit=20');
    expect(getAdvisorAppRoute('/foreman_rh_cloud/recommendations/rule-id')).toBe('recommendations/rule-id');
    expect(getAdvisorAppRoute('/foreman_rh_cloud/recommendations/pathways/pathway-id')).toBe('recommendations/pathways/pathway-id');
  });
  it('preserves deep links and queries under the new namespace', () => {
    const route = 'systems/host-id?activeRule=true';
    expect(getAdvisorAppRoute(getAdvisorForemanPath(route))).toBe(route);
  });
  it('keeps the standalone entry on the same origin', () => {
    expect(getAdvisorIframeSrc()).toBe(`${window.location.origin}/assets/apps/advisor/index.html`);
  });
  it('rejects paths outside the supported namespace', () => {
    expect(getAdvisorForemanPath('https://external.example')).toBe('/foreman_rh_cloud/insights_advisor/recommendations');
    expect(getAdvisorForemanPath('systems/../admin')).toBe('/foreman_rh_cloud/insights_advisor/recommendations');
  });
});
