/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Button } from 'patternfly-react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import { STATUS } from 'foremanReact/constants';
import InsightsHeader from './Components/InsightsHeader';
import {
  INSIGHTS_SYNC_PAGE_TITLE,
  INSIGHTS_SEARCH_PROPS,
} from './InsightsCloudSyncConstants';
import { NoTokenEmptyState } from './Components/NoTokenEmptyState';
import { ErrorEmptyState } from './Components/ErrorEmptyState';

const InsightsCloudSync = ({
  syncInsights,
  query,
  fetchInsights,
  page,
  perPage: urlPerPage,
  hasToken,
  status,
}) => {
  const { perPage: appPerPage } = useForemanSettings();
  const perPage = urlPerPage || appPerPage;

  // acts as componentDidMount
  useEffect(() => {
    fetchInsights({ page, perPage, searchQuery: query });
  }, []);
  if (status === STATUS.ERROR) {
    return (
      <PageLayout
        header={`${INSIGHTS_SYNC_PAGE_TITLE} ${__('ERROR')}`}
        searchable={false}
      >
        <ErrorEmptyState />
      </PageLayout>
    );
  }

  // TODO: add here && !data.length
  if (status === STATUS.PENDING) {
    return (
      <PageLayout
        header={`${INSIGHTS_SYNC_PAGE_TITLE} ${__('Loading')}`}
        searchable={false}
      >
        <EmptyState>
          <EmptyStateIcon variant="container" component={Spinner} />
        </EmptyState>
      </PageLayout>
    );
  }

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
      onSearch={searchQuery => fetchInsights({ searchQuery, page: 1 })}
      header={INSIGHTS_SYNC_PAGE_TITLE}
      toolbarButtons={
        <Button bsStyle="primary" onClick={syncInsights}>
          {__('Sync now')}
        </Button>
      }
      searchQuery={query}
      beforeToolbarComponent={<InsightsHeader />}
    >
      <React.Fragment>
        <p>Insights Table will be here</p>
      </React.Fragment>
    </PageLayout>
  );
};

InsightsCloudSync.propTypes = {
  syncInsights: PropTypes.func.isRequired,
  fetchInsights: PropTypes.func.isRequired,
  page: PropTypes.number,
  perPage: PropTypes.number,
  query: PropTypes.string,
  hasToken: PropTypes.bool,
  status: PropTypes.string,
};

InsightsCloudSync.defaultProps = {
  page: 1,
  perPage: null,
  query: '',
  hasToken: false,
  status: STATUS.PENDING,
};

export default InsightsCloudSync;
