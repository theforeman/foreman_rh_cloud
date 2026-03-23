import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SearchBar from 'foremanReact/components/SearchBar';
import { translate as __ } from 'foremanReact/common/I18n';
import { ScalprumComponent, ScalprumProvider } from '@scalprum/react-core';
import { Grid, GridItem } from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core/deprecated';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import InsightsTable from '../InsightsCloudSync/Components/InsightsTable';
import RemediationModal from '../InsightsCloudSync/Components/RemediationModal';
import Pagination from '../InsightsCloudSync/Components/InsightsTable/Pagination';
import { INSIGHTS_SEARCH_PROPS } from '../InsightsCloudSync/InsightsCloudSyncConstants';
import { fetchInsights } from '../InsightsCloudSync/Components/InsightsTable/InsightsTableActions';
import {
  selectSearch,
  selectHits,
} from '../InsightsCloudSync/Components/InsightsTable/InsightsTableSelectors';
import { redHatAdvisorSystems } from '../InsightsCloudSync/InsightsCloudSyncHelpers';
import { useIopConfig } from '../common/Hooks/ConfigHooks';
import { generateRuleUrl } from '../InsightsCloudSync/InsightsCloudSync';
import { createProviderOptions } from '../common/ScalprumModule/ScalprumContext';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';
import { isNotRhelHost, hasNoInsightsFacet } from '../ForemanRhCloudHelpers';

// Hosted Insights advisor
const NewHostDetailsTab = ({ hostName, router }) => {
  const dispatch = useDispatch();
  const query = useSelector(selectSearch);
  const hits = useSelector(selectHits);
  const isIop = useIopConfig();

  useEffect(
    () => () => {
      // Preserve hash when clearing search params to prevent tab navigation bugs
      if (router && typeof router.replace === 'function') {
        const replaceOptions = { search: null };
        if (router.location && router.location.hash) {
          replaceOptions.hash = router.location.hash;
        }
        router.replace(replaceOptions);
      }
    },
    [router]
  );

  const onSearch = q => dispatch(fetchInsights({ query: q, page: 1 }));

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const onSatInsightsClick = () => {
    if (router && typeof router.push === 'function') {
      router.push({ pathname: '/foreman_rh_cloud/insights_cloud' });
    }
  };

  const dropdownItems = [
    <DropdownItem key="insights-link" ouiaId="insights-link">
      <a onClick={onSatInsightsClick}>{__('Go to Foreman Insights page')}</a>
    </DropdownItem>,
  ];

  if (hits.length && !isIop) {
    const { host_uuid: uuid } = hits[0];
    dropdownItems.push(
      <DropdownItem key="insights-advisor-link" ouiaId="insights-advisor-link">
        <a
          href={redHatAdvisorSystems(uuid)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {__('View in Red Hat Insights')}
          {'  '}
          <ExternalLinkAltIcon />
        </a>
      </DropdownItem>
    );
  }

  return (
    <Grid id="new_host_details_insights_tab" hasGutter>
      <GridItem span={5}>
        <SearchBar
          data={INSIGHTS_SEARCH_PROPS}
          onSearch={onSearch}
          initialQuery={query}
        />
      </GridItem>
      <GridItem span={4}>
        <RemediationModal />
        <Dropdown
          className="insights-dropdown"
          ouiaId="insights-dropdown"
          onSelect={() => setIsDropdownOpen(false)}
          toggle={
            <KebabToggle
              onToggle={(_event, isOpen) => setIsDropdownOpen(isOpen)}
            />
          }
          isOpen={isDropdownOpen}
          isPlain
          dropdownItems={dropdownItems}
        />
      </GridItem>
      <GridItem span={3}>
        <Pagination ouiaId="insights-pagination" variant="top" isCompact />
      </GridItem>
      <GridItem>
        <InsightsTable hideHost hostname={hostName} />
      </GridItem>
    </Grid>
  );
};

NewHostDetailsTab.propTypes = {
  hostName: PropTypes.string,
  router: PropTypes.object,
};

NewHostDetailsTab.defaultProps = {
  hostName: '',
  router: {},
};

// Local Insights advisor
const scope = 'advisor';
const module = './SystemDetailWrapped';

const IopInsightsTab = props => {
  // eslint-disable-next-line camelcase
  const systemId = props.response?.subscription_facet_attributes?.uuid;
  return (
    <div className="advisor">
      <ScalprumComponent
        key={systemId || props.hostName}
        scope={scope}
        module={module}
        IopRemediationModal={RemediationModal}
        generateRuleUrl={generateRuleUrl}
        {...props}
      />
    </div>
  );
};

IopInsightsTab.propTypes = {
  hostName: PropTypes.string,
  response: PropTypes.object,
};

IopInsightsTab.defaultProps = {
  hostName: '',
  response: {},
};

const IopInsightsTabWrapped = props => {
  const permissions = useInsightsPermissions();
  return (
    <ScalprumProvider {...createProviderOptions(permissions)}>
      <IopInsightsTab {...props} />
    </ScalprumProvider>
  );
};

const InsightsTab = props => {
  const { response } = props;
  const history = useHistory();
  const isIop = useIopConfig();
  const isHostDataLoaded = Boolean(response?.id);
  const shouldHideTab =
    isHostDataLoaded &&
    (isNotRhelHost({ hostDetails: response }) ||
      hasNoInsightsFacet({ response, hostDetails: response }));

  useEffect(() => {
    if (shouldHideTab && history) {
      history.replace('/Overview');
    }
  }, [shouldHideTab, history]);

  if (shouldHideTab) {
    return null;
  }

  return isIop ? (
    <IopInsightsTabWrapped {...props} />
  ) : (
    <NewHostDetailsTab {...props} />
  );
};

InsightsTab.propTypes = {
  response: PropTypes.object,
};

InsightsTab.defaultProps = {
  response: {},
};

export default InsightsTab;
