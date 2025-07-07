import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PageLayout from 'foremanReact/routes/common/PageLayout/PageLayout';
import { TextInput, Button } from '@patternfly/react-core';
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

const LocalAdvisorPlaceholder = props => {
  const { config, setConfig } = useContext(ScalprumContext);
  const [scope, setScope] = useState('advisor');
  const path = `apps/${scope}`;
  const module = './RulesTableWrapped';
  const manifestLocation = `/${path}/fed-mods.json`;

  const [value, setValue] = useState(scope);

  useEffect(() => {
    setConfig({
      [scope]: {
        name: scope,
        manifestLocation,
        cdnPath: `/${path}/`,
      },
    });
  }, [setConfig, scope, path, manifestLocation]);

  return (
    <>
      <span>
        <TextInput
          value={value}
          type="text"
          onChange={(_event, val) => setValue(val)}
          aria-label="manifest location"
        />
        <Button variant="primary" onClick={() => setScope(value)}>
          Set scope
        </Button>
      </span>
      <pre style={{ paddingBottom: '2em' }}>{manifestLocation}</pre>
      {config[scope] && (
        <ScalprumComponent scope={scope} module={module} {...props} />
      )}
    </>
  );
};

const LocalAdvisorPlaceholderWrapped = () => (
  <ScalprumContextWrapper>
    <LocalAdvisorPlaceholder IopRemediationModal={RemediationModal} />
  </ScalprumContextWrapper>
);

const RecommendationsPage = props => {
  // TODO: remove next line before merging
  return <LocalAdvisorPlaceholderWrapped />;

  // eslint-disable-next-line no-unreachable
  const isLocalAdvisorEngine = useAdvisorEngineConfig();

  return isLocalAdvisorEngine ? (
    <LocalAdvisorPlaceholder />
  ) : (
    <InsightsCloudSync {...props} />
  );
};

export default RecommendationsPage;
