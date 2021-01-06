import React from 'react';
import { Button } from 'patternfly-react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import InsightsHeader from './Components/InsightsHeader';
import { NoTokenEmptyState } from './Components/NoTokenEmptyState';
import InsightsTable from './Components/InsightsTable';
import {
  INSIGHTS_SYNC_PAGE_TITLE,
  INSIGHTS_SEARCH_PROPS,
} from './InsightsCloudSyncConstants';

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
  return (
    <PageLayout
      searchable
      searchProps={INSIGHTS_SEARCH_PROPS}
      onSearch={nextQuery => fetchInsights({ query: nextQuery, page: 1 })}
      header={INSIGHTS_SYNC_PAGE_TITLE}
      toolbarButtons={
        <Button bsStyle="primary" onClick={syncInsights}>
          {__('Sync now')}
        </Button>
      }
      searchQuery={query}
      beforeToolbarComponent={<InsightsHeader />}
    >
      <InsightsTable />
    </PageLayout>
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
