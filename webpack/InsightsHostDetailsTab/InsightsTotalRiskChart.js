import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { useHistory } from 'react-router-dom';
import { DropdownItem, Bullseye, Title } from '@patternfly/react-core';
import { ChartDonut, ChartLegend, ChartLabel } from '@patternfly/react-charts';
import { STATUS } from 'foremanReact/constants';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import CardTemplate from 'foremanReact/components/HostDetails/Templates/CardItem/CardTemplate';
import { translate as __ } from 'foremanReact/common/I18n';
import SkeletonLoader from 'foremanReact/components/common/SkeletonLoader';
import { insightsCloudUrl } from '../InsightsCloudSync/InsightsCloudSyncHelpers';
import { getInitialRisks, theme } from './InsightsTabConstants';

const InsightsTotalRiskCard = ({ hostDetails: { id } }) => {
  const [totalRisks, setTotalRisks] = useState(getInitialRisks());
  const hashHistory = useHistory();
  const dispatch = useDispatch();
  const API_KEY = `HOST_${id}_RECOMMENDATIONS`;
  const API_OPTIONS = useMemo(() => ({ key: API_KEY }), [API_KEY]);
  const {
    status = STATUS.PENDING,
    response: { hits = [] },
  } = useAPI('get', insightsCloudUrl(`hits/${id}`), API_OPTIONS);

  useEffect(() => {
    if (status !== STATUS.PENDING) {
      const risks = getInitialRisks();
      hits.forEach(({ total_risk: risk }) => {
        risks[risk].value += 1;
      });
      risks.total = hits.length;
      setTotalRisks(risks);
    }
  }, [hits, status]);

  const onChartClick = (evt, { index }) => {
    hashHistory.push(`/Insights`);
    dispatch(
      push({
        search: `search=total_risk+%3D+${index + 1}`,
      })
    );
  };

  const onChartHover = (evt, { index }) => [
    {
      mutation: ({ style }) => ({
        style: { ...style, fill: totalRisks[index + 1]?.hoverFill },
      }),
    },
  ];

  const { 1: low, 2: moderate, 3: important, 4: critical, total } = totalRisks;

  // eslint-disable-next-line react/prop-types
  const LegendLabel = ({ index, ...rest }) => (
    <a key={index} onClick={() => onChartClick(null, { index })}>
      <ChartLabel {...rest} />
    </a>
  );

  const legend = (
    <ChartLegend
      height={400}
      width={200}
      fontSize={14}
      rowGutter={{ top: -5, bottom: -5 }}
      orientation="vertical"
      labelComponent={<LegendLabel />}
      data={[
        { name: `${low.title}: ${low.value}` },
        { name: `${moderate.title}: ${moderate.value}` },
        { name: `${important.title}: ${important.value}` },
        { name: `${critical.title}: ${critical.value}` },
      ]}
    />
  );

  const cardBody = (
    <ChartDonut
      ariaDesc="Number of recommendations total-risks"
      constrainToVisibleArea
      data={[
        { x: low.title, y: low.value },
        { x: moderate.title, y: moderate.value },
        { x: important.title, y: important.value },
        { x: critical.title, y: critical.value },
      ]}
      labels={({ datum: { x, y } }) => `${x}: ${y}`}
      legendComponent={legend}
      legendPosition="right"
      subTitle="Recommendations"
      title={`${total}`}
      padding={{
        bottom: 20,
        left: 20,
        right: 140,
        top: 20,
      }}
      width={350}
      theme={theme}
      events={[
        {
          target: 'data',
          eventHandlers: {
            onClick: onChartClick,
            onMouseOver: onChartHover,
            onMouseOut: () => [{ mutation: () => null }],
          },
        },
      ]}
    />
  );

  return (
    <CardTemplate
      header={__('Total Risks')}
      dropdownItems={[
        <DropdownItem
          key="insights-tab"
          onClick={() => hashHistory.push(`/Insights`)}
        >
          {__('View all recommendations')}
        </DropdownItem>,
      ]}
    >
      <SkeletonLoader
        status={status}
        emptyState={
          <Bullseye>
            <Title headingLevel="h4"> {__('No results found')} </Title>
          </Bullseye>
        }
      >
        <div id="rh-cloud-total-risk-card">{cardBody}</div>
      </SkeletonLoader>
    </CardTemplate>
  );
};

InsightsTotalRiskCard.propTypes = {
  hostDetails: PropTypes.object.isRequired,
};

export default InsightsTotalRiskCard;
