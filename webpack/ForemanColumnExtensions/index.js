import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { propsToCamelCase } from 'foremanReact/common/helpers';

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

const hostsIndexColumnExtensions = [
  {
    columnName: 'insights_recommendations_count',
    title: __('Recommendations'),
    wrapper: RecommendationsCell,
    weight: 1500,
    isSorted: true,
  },
];

hostsIndexColumnExtensions.forEach(column => {
  column.tableName = 'hosts';
  column.categoryName = 'Insights';
  column.categoryKey = 'insights';
});

export default hostsIndexColumnExtensions;
