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
    const pollingProcessID = setInterval(fetchLogs, 5000);
    startPolling(pollingProcessID);
  }

  componentWillUnmount() {
    const { stopPolling } = this.props;
    stopPolling();
  }

  render() {
    const {
      setActiveTab,
      uploading,
      restartProcess,
      downloadReports,
    } = this.props;
    return (
      <NavContainer
        items={[
          {
            icon: 'database',
            name: 'Generating',
            component: ReportGenerate,
            onClick: () => setActiveTab('reports'),
          },
          {
            icon: 'cloud-upload',
            name: 'Uploading',
            component: ReportUpload,
            props: { ...uploading, restartProcess, downloadReports },
            onClick: () => setActiveTab('uploads'),
          },
        ]}
      />
    );
  }
}

Dashboard.propTypes = {
  startPolling: PropTypes.func,
  fetchLogs: PropTypes.func,
  stopPolling: PropTypes.func,
  setActiveTab: PropTypes.func,
  uploading: PropTypes.shape({
    exitCode: PropTypes.string,
    loading: PropTypes.bool,
    logs: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    completed: PropTypes.number,
    files: PropTypes.arrayOf(PropTypes.string),
    downloadReports: PropTypes.func,
    error: PropTypes.string,
  }),
  restartProcess: PropTypes.func,
  downloadReports: PropTypes.func,
};

Dashboard.defaultProps = {
  uploading: {},
  startPolling: noop,
  fetchLogs: noop,
  stopPolling: noop,
  setActiveTab: noop,
  restartProcess: noop,
  downloadReports: noop,
};

export default Dashboard;
