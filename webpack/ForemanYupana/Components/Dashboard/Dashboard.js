import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import ReportGenerate from '../ReportGenerate';
import ReportUpload from '../ReportUpload';
import NavContainer from '../NavContainer';
import './dashboard.scss';

class Dashboard extends React.Component {
  componentDidMount() {
    const { startPolling, fetchLogs } = this.props;
    const pollingProcessID = setInterval(fetchLogs, 2000);
    startPolling(pollingProcessID);
  }

  componentWillUnmount() {
    const { stopPolling } = this.props;
    stopPolling();
  }

  render() {
    const { setActiveTab } = this.props;
    return (
      <NavContainer
        items={[
          {
            icon: 'database',
            name: 'Generating',
            component: ReportGenerate,
          },
          {
            icon: 'cloud-upload',
            name: 'Uploading',
            component: ReportUpload,
          },
        ]}
        onTabClick={setActiveTab}
      />
    );
  }
}

Dashboard.propTypes = {
  startPolling: PropTypes.func,
  fetchLogs: PropTypes.func,
  stopPolling: PropTypes.func,
  setActiveTab: PropTypes.func,
};

Dashboard.defaultProps = {
  startPolling: noop,
  fetchLogs: noop,
  stopPolling: noop,
  setActiveTab: noop,
};

export default Dashboard;
