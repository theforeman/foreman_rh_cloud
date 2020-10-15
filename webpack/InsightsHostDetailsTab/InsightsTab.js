import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Grid, ListView, noop } from 'patternfly-react';
import ListItem from './components/ListItem';
import './InsightsTab.scss';

class InsightsHostDetailsTab extends React.Component {
  componentDidMount() {
    const { fetchHits, hostID } = this.props;
    fetchHits(hostID);

    const { hash } = window.location;
    if (hash === '#insights') {
      document.querySelector(`li > a[href='${hash}']`).click();
    }
  }

  render() {
    const { hits } = this.props;

    if (!hits.length) {
      return <h2>No recommendations were found for this host!</h2>;
    }
    const hitsSorted = orderBy(hits, ['insights_hit.total_risk'], ['desc']);
    const items = hitsSorted.map(
      (
        {
          insights_hit: {
            title,
            total_risk: totalRisk,
            results_url: resultsUrl,
            solution_url: solutionUrl,
          },
        },
        index
      ) => (
        <ListItem
          key={index}
          title={title}
          totalRisk={totalRisk}
          resultsUrl={resultsUrl}
          solutionUrl={solutionUrl}
        />
      )
    );
    return (
      <div id="host_details_insights_tab">
        <Grid.Row>
          <Grid.Col xs={12}>
            <h2>Recommendations</h2>
            <ListView id="hits_list">{items}</ListView>
          </Grid.Col>
        </Grid.Row>
      </div>
    );
  }
}

InsightsHostDetailsTab.propTypes = {
  hostID: PropTypes.number.isRequired,
  fetchHits: PropTypes.func,
  hits: PropTypes.array,
};

InsightsHostDetailsTab.defaultProps = {
  fetchHits: noop,
  hits: [],
};

export default InsightsHostDetailsTab;
