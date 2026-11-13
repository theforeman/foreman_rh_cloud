import PropTypes from 'prop-types';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { insightsCloudUrl } from '../InsightsCloudSync/InsightsCloudSyncHelpers';
import { useIopConfig } from '../common/Hooks/ConfigHooks';

const complianceSystemPath = uuid =>
  insightsCloudUrl(`api/compliance/v2/systems/${uuid}`);

export const CompliancePoliciesCell = ({ hostDetails }) => {
  const isIopEnabled = useIopConfig();
  // eslint-disable-next-line camelcase
  const uuid = hostDetails?.subscription_facet_attributes?.uuid;

  const { response } = useAPI(
    isIopEnabled && uuid ? 'get' : null,
    uuid ? complianceSystemPath(uuid) : null,
    { key: `HOST_COMPLIANCE_POLICIES_${uuid}` }
  );

  if (!isIopEnabled || !uuid) {
    return '—';
  }

  const policies = response?.data?.policies;
  if (!Array.isArray(policies) || policies.length === 0) {
    return '—';
  }

  const names = policies.map(policy => policy?.title).filter(Boolean);
  return names.length === 0 ? '—' : names.join(', ');
};

CompliancePoliciesCell.propTypes = {
  hostDetails: PropTypes.object.isRequired,
};

export default CompliancePoliciesCell;
