import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import ReportGenerate from '../ReportGenerate';
import ReportUpload from '../ReportUpload';
import NavContainer from '../NavContainer';
import './dashboard.scss';

class Dashboard extends React.Component {
  componentDidMount() {
    const { startPolling, fetchLogs, getReportsQueue } = this.props;
    const pollingProcessID = setInterval(fetchLogs, 5000);
    startPolling(pollingProcessID);
    getReportsQueue();
  }

  componentWillUnmount() {
    const { stopPolling, pollingProcessID } = this.props;
    stopPolling(pollingProcessID);
  }

  render() {
    const {
      setActiveTab,
      uploading,
      generating,
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
            props: { ...generating, restartProcess },
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
    files: PropTypes.shape({
      queue: PropTypes.arrayOf(PropTypes.string),
      error: PropTypes.string,
    }),
    error: PropTypes.string,
  }),
  generating: PropTypes.shape({
    exitCode: PropTypes.string,
    loading: PropTypes.bool,
    logs: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
    completed: PropTypes.number,
    error: PropTypes.string,
  }),
  restartProcess: PropTypes.func,
  downloadReports: PropTypes.func,
  pollingProcessID: PropTypes.number,
  getReportsQueue: PropTypes.func,
};

Dashboard.defaultProps = {
  uploading: {},
  generating: {},
  startPolling: noop,
  fetchLogs: noop,
  stopPolling: noop,
  setActiveTab: noop,
  restartProcess: noop,
  downloadReports: noop,
  pollingProcessID: 0,
  getReportsQueue: noop,
};

export default Dashboard;
