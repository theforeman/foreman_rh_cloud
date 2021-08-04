import React from 'react';
import PropTypes from 'prop-types';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import InsightsHeader from './Components/InsightsHeader';
import { NoTokenEmptyState } from './Components/NoTokenEmptyState';
import InsightsTable from './Components/InsightsTable';
import RemediationModal from './Components/RemediationModal';
import {
  INSIGHTS_SYNC_PAGE_TITLE,
  INSIGHTS_SEARCH_PROPS,
} from './InsightsCloudSyncConstants';
import './InsightsCloudSync.scss';
import Pagination from './Components/InsightsTable/Pagination';
import ToolbarDropdown from './Components/ToolbarDropdown';

const InsightsCloudSync = ({
  syncInsights,
  query,
  fetchInsights,
  hasToken,
}) => {
  if (!hasToken) {
    return (
      <PageLayout header={INSIGHTS_SYNC_PAGE_TITLE} searchable={false}>
        <NoTokenEmptyState />
      </PageLayout>
    );
  }

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
      <PageLayout
        searchable
        searchProps={INSIGHTS_SEARCH_PROPS}
        onSearch={nextQuery => fetchInsights({ query: nextQuery, page: 1 })}
        header={INSIGHTS_SYNC_PAGE_TITLE}
        toolbarButtons={toolbarButtons}
        searchQuery={query}
        beforeToolbarComponent={<InsightsHeader />}
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
  hasToken: PropTypes.bool,
};

InsightsCloudSync.defaultProps = {
  query: '',
  hasToken: true,
};

export default InsightsCloudSync;
