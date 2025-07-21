import React from 'react';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { propsToCamelCase } from 'foremanReact/common/helpers';
import { CVECountCell } from '../InsightsVulnerabilityHostIndexExtensions/CVECountCell';
import { providerOptions } from '../common/ScalprumModule/ScalprumContext';

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

const IopRecommendationsCell = hostDetails => {
  const scope = 'advisor';
  const module = './RecommendationsCellWrapped';

  return (
    <span className="rh-cloud-insights-recommendations-cell">
      <ScalprumComponent scope={scope} module={module} />
    </span>
  );
};

const IopRecommendationsCellWrapped = hostDetails => (
  <ScalprumProvider {...providerOptions}>
    <IopRecommendationsCell hostDetails={hostDetails} />
  </ScalprumProvider>
);

const RecommendationsCell = hostDetails => {
  const insightsAttributes = propsToCamelCase(
    // eslint-disable-next-line camelcase
    hostDetails?.insights_attributes ?? {}
  );

  return insightsAttributes.useLocalAdvisorEngine ? (
    <IopRecommendationsCellWrapped hostDetails={hostDetails} />
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
