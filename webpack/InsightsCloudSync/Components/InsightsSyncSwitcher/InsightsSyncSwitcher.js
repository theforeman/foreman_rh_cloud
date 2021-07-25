import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import SwitcherPF4 from '../../../common/Switcher/SwitcherPF4';

class InsightsSyncSwitcher extends Component {
  handleToggle = () => {
    const { insightsSyncEnabled, setInsightsSyncEnabled } = this.props;

    const toggledInsightsSyncEnabled = !insightsSyncEnabled;
    setInsightsSyncEnabled(toggledInsightsSyncEnabled);
  };

  render() {
    const { insightsSyncEnabled } = this.props;

    return (
      <SwitcherPF4
        id="insights_sync_switcher"
        label={__('Auto Sync')}
        tooltip={__(
          'Enable automatic synchronization of Insights recommendations from the Red Hat cloud'
        )}
        isChecked={insightsSyncEnabled}
        onChange={this.handleToggle}
      />
    );
  }
}

InsightsSyncSwitcher.propTypes = {
  insightsSyncEnabled: PropTypes.bool,
  setInsightsSyncEnabled: PropTypes.func.isRequired,
};

InsightsSyncSwitcher.defaultProps = {
  insightsSyncEnabled: true,
};

export default InsightsSyncSwitcher;
