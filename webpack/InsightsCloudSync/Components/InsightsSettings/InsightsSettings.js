import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InsightsSyncSwitcher from '../InsightsSyncSwitcher';
import './insightsSettings.scss';

class InsightsSettings extends Component {
  componentDidMount() {
    const { getInsightsSyncSettings } = this.props;
    getInsightsSyncSettings();
  }

  render() {
    const { insightsSyncEnabled, setInsightsSyncEnabled } = this.props;
    return (
      <div className="insights_settings">
        <InsightsSyncSwitcher
          insightsSyncEnabled={insightsSyncEnabled}
          setInsightsSyncEnabled={setInsightsSyncEnabled}
        />
      </div>
    );
  }
}

InsightsSettings.propTypes = {
  insightsSyncEnabled: PropTypes.bool.isRequired,
  getInsightsSyncSettings: PropTypes.func.isRequired,
  setInsightsSyncEnabled: PropTypes.func.isRequired,
};

export default InsightsSettings;
