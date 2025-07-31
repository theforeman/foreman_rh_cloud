import React from 'react';
import PropTypes from 'prop-types';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { Link } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';
import { propsToCamelCase } from 'foremanReact/common/helpers';
import { CVECountCell } from '../InsightsVulnerabilityHostIndexExtensions/CVECountCell';

const HostedRecommendationsCell = hostDetails => {
  const insightsAttributes = propsToCamelCase(
    // eslint-disable-next-line camelcase
    hostDetails?.insights_attributes ?? {}
  );
  const { insightsHitsCount: hitsCount } = insightsAttributes;
  if (hitsCount === undefined || hitsCount === null) return '—';
  const hostname = hostDetails?.name;
  const encodedHostname = encodeURIComponent(hostname);
  const hitsUrl = `/foreman_rh_cloud/insights_cloud?search=hostname+%3D+${encodedHostname}`;
  return <a href={hitsUrl}>{hitsCount}</a>;
};

const IopRecommendationsCell = ({ hostDetails }) => {
  // eslint-disable-next-line camelcase
  const uuid = hostDetails?.insights_attributes?.uuid;
  const { response } = useAPI(
    uuid ? 'get' : null,
    `/insights_cloud/api/insights/v1/system/${uuid}`,
    { key: `HOST_RECS_COUNT_${uuid}` }
  );

  const hits = response?.hits;
  return hits === undefined ? (
    '—'
  ) : (
    <Link to={`hosts/${hostDetails.name}#/Insights`}>{hits}</Link>
  );
};

IopRecommendationsCell.propTypes = {
  hostDetails: PropTypes.object.isRequired,
};

const RecommendationsCell = hostDetails => {
  const insightsAttributes = propsToCamelCase(
    // eslint-disable-next-line camelcase
    hostDetails?.insights_attributes ?? {}
  );

  return insightsAttributes.useLocalAdvisorEngine ? (
    <IopRecommendationsCell hostDetails={hostDetails} />
  ) : (
    <HostedRecommendationsCell hostDetails={hostDetails} />
  );
};

const insightsCategoryName = __('Insights');

const hostsIndexColumnExtensions = [
  {
    columnName: 'insights_recommendations_count',
    title: __('Recommendations'),
    wrapper: RecommendationsCell,
    weight: 1500,
    isSorted: true,
    tableName: 'hosts',
    categoryName: insightsCategoryName,
    categoryKey: 'insights',
  },
  {
    columnName: 'cves_count',
    title: __('Total CVEs'),
    wrapper: hostDetails => <CVECountCell hostDetails={hostDetails} />,
    weight: 2600,
    tableName: 'hosts',
    categoryName: insightsCategoryName,
    categoryKey: 'insights',
    isSorted: false,
  },
];

export default hostsIndexColumnExtensions;
