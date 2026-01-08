import { useMemo } from 'react';
import { useForemanContext } from 'foremanReact/Root/Context/ForemanContext';

/**
 * Mapping from Foreman permissions to Insights Chrome API permissions.
 * Used to convert Foreman's permission names to the format expected by
 * Scalprum-loaded Insights apps (vulnerability-ui, advisor).
 *
 * When adding new permissions, update both:
 * - This mapping (for front-end RBAC in Scalprum apps)
 * - The SCOPED_REQUESTS in app/services/foreman_rh_cloud/insights_api_forwarder.rb (for backend API enforcement)
 */
const PERMISSION_MAPPING = {
  view_vulnerability: [
    'inventory:hosts:read',
    'vulnerability:vulnerability_results:read',
    'vulnerability:system.opt_out:read',
    'vulnerability:report_and_export:read',
    'vulnerability:advanced_report:read',
  ],
  edit_vulnerability: [
    'vulnerability:system.cve.status:write',
    'vulnerability:cve.business_risk_and_status:write',
    'vulnerability:system.opt_out:write',
  ],
  view_advisor: ['advisor:recommendation-results:read', 'advisor:exports:read'],
  edit_advisor: ['advisor:disable-recommendations:write'],
};

/**
 * Hook to access Insights permissions in Chrome API format.
 * Reads Foreman permissions from context and converts them to the format
 * expected by Scalprum-loaded Insights apps.
 *
 * Uses ForemanContext.metadata.permissions (added in Foreman PR #10338).
 * Falls back to empty permissions if not available (older Foreman versions).
 *
 * @see https://github.com/theforeman/foreman/blob/develop/developer_docs/handling_user_permissions.asciidoc
 * @returns {Array<{permission: string, resourceDefinitions: Array}>} User's Insights permissions
 */
export const useInsightsPermissions = () => {
  const context = useForemanContext();
  const userPermissions = context?.metadata?.permissions || new Set();

  return useMemo(
    () =>
      Object.entries(PERMISSION_MAPPING).flatMap(
        ([foremanPerm, insightsPerms]) =>
          userPermissions.has(foremanPerm)
            ? insightsPerms.map(perm => ({
                permission: perm,
                resourceDefinitions: [],
              }))
            : []
      ),
    [userPermissions]
  );
};
