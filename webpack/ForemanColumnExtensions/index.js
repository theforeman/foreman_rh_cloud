import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { propsToCamelCase } from 'foremanReact/common/helpers';
import { CVECountCell } from '../InsightsVulnerabilityHostIndexExtensions/CVECountCell';

const RecommendationsCell = hostDetails => {
  const insightsAttributes = propsToCamelCase(
    // eslint-disable-next-line camelcase
    hostDetails?.insights_attributes ?? {}
  );
  // Local insights advisor
  if (insightsAttributes.useLocalAdvisorEngine) {
    // TODO: Replace this placeholder with the actual local advisor integration
    return <span>Local advisor placeholder</span>;
  }

  // Hosted insights advisor
  const { insightsHitsCount: hitsCount } = insightsAttributes;
  if (hitsCount === undefined || hitsCount === null) return '—';
  const hostname = hostDetails?.name;
  const encodedHostname = encodeURIComponent(hostname);
  const hitsUrl = `/foreman_rh_cloud/insights_cloud?search=hostname+%3D+${encodedHostname}`;
  return <a href={hitsUrl}>{hitsCount}</a>;
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
