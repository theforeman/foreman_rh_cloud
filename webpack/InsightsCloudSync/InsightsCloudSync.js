import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { ScalprumComponent } from '@scalprum/react-core';
import {
  ScalprumContextWrapper,
  ScalprumContext,
} from '../common/ScalprumModule/ScalprumContext';
import InsightsTable from './Components/InsightsTable';
import { useAdvisorEngineConfig } from '../common/Hooks/ConfigHooks';
import RemediationModal from './Components/RemediationModal';
import {
  INSIGHTS_SYNC_PAGE_TITLE,
  INSIGHTS_SEARCH_PROPS,
} from './InsightsCloudSyncConstants';
import './InsightsCloudSync.scss';
import Pagination from './Components/InsightsTable/Pagination';
import ToolbarDropdown from './Components/ToolbarDropdown';
import InsightsSettings from './Components/InsightsSettings';

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

const scope = 'advisor';
const path = `apps/${scope}`;
const module = './RulesTableWrapped';
const manifestLocation = `/${path}/fed-mods.json`;

const LocalAdvisorRecommendationsPage = props => {
  const { setConfig } = useContext(ScalprumContext);

  useEffect(() => {
    setConfig({
      [scope]: {
        name: scope,
        manifestLocation,
        cdnPath: `${window.location.origin}/${path}/`,
      },
    });
  }, [setConfig]);

  return <ScalprumComponent scope={scope} module={module} {...props} />;
};

const LocalAdvisorRecommendationsPageWrapped = () => (
  <ScalprumContextWrapper>
    <LocalAdvisorRecommendationsPage IopRemediationModal={RemediationModal} />
  </ScalprumContextWrapper>
);

const RecommendationsPage = props => {
  const isLocalAdvisorEngine = useAdvisorEngineConfig();

  return isLocalAdvisorEngine ? (
    <LocalAdvisorRecommendationsPageWrapped />
  ) : (
    <InsightsCloudSync {...props} />
  );
};

export default RecommendationsPage;
