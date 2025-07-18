import React from 'react';
import PropTypes from 'prop-types';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import InsightsTable from './Components/InsightsTable';
import { useAdvisorEngineConfig } from '../common/Hooks/ConfigHooks';
import { foremanUrl } from '../ForemanRhCloudHelpers';
import RemediationModal from './Components/RemediationModal';
import {
  INSIGHTS_SYNC_PAGE_TITLE,
  INSIGHTS_SEARCH_PROPS,
} from './InsightsCloudSyncConstants';
import './InsightsCloudSync.scss';
import Pagination from './Components/InsightsTable/Pagination';
import ToolbarDropdown from './Components/ToolbarDropdown';
import InsightsSettings from './Components/InsightsSettings';
import { providerOptions } from '../common/ScalprumModule/ScalprumContext';

// Hosted Insights advisor
const InsightsCloudSync = ({ syncInsights, query, fetchInsights }) => {
  const onRecommendationSync = () => syncInsights(fetchInsights, query);
  const toolbarButtons = (
    <>
      <span className="insights-toolbar-buttons">
        <RemediationModal />
        <ToolbarDropdown onRecommendationSync={onRecommendationSync} />
      </span>
      <span className="pull-right">
        <Pagination variant="top" isCompact />
      </span>
    </>
  );

  return (
    <div className="rh-cloud-insights">
      <InsightsSettings />
      <PageLayout
        searchable
        searchProps={INSIGHTS_SEARCH_PROPS}
        onSearch={nextQuery => fetchInsights({ query: nextQuery, page: 1 })}
        header={INSIGHTS_SYNC_PAGE_TITLE}
        toolbarButtons={toolbarButtons}
        searchQuery={query}
        beforeToolbarComponent={null}
      >
        <InsightsTable />
      </PageLayout>
    </div>
  );
};

InsightsCloudSync.propTypes = {
  syncInsights: PropTypes.func.isRequired,
  fetchInsights: PropTypes.func.isRequired,
  query: PropTypes.string,
};

InsightsCloudSync.defaultProps = {
  query: '',
};

// Local Insights advisor
const scope = 'advisor';
const module = './ListWrapped';

export const generateRuleUrl = ruleId =>
  foremanUrl(`/foreman_rh_cloud/recommendations/${ruleId}`);

const IopRecommendationsPage = props => (
  <ScalprumComponent
    scope={scope}
    module={module}
    IopRemediationModal={RemediationModal}
    generateRuleUrl={generateRuleUrl}
    {...props}
  />
);

const IopRecommendationsPageWrapped = props => (
  <ScalprumProvider {...providerOptions}>
    <IopRecommendationsPage {...props} />
  </ScalprumProvider>
);

const RecommendationsPage = props => {
  const isLocalAdvisorEngine = useAdvisorEngineConfig();

  return isLocalAdvisorEngine ? (
    <IopRecommendationsPageWrapped {...props} />
  ) : (
    <InsightsCloudSync {...props} />
  );
};

export default RecommendationsPage;
