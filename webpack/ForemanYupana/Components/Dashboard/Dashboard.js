import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import ReportGenerate from '../ReportGenerate';
import ReportUpload from '../ReportUpload';
import NavContainer from '../NavContainer';
import './dashboard.scss';

class Dashboard extends React.Component {
  componentDidMount() {
    const { startPolling, fetchLogs, accountID } = this.props;
    fetchLogs(accountID);
    const pollingProcessID = setInterval(() => fetchLogs(accountID), 5000);
    startPolling(accountID, pollingProcessID);
  }

  componentWillUnmount() {
    const { stopPolling, pollingProcessID, accountID } = this.props;
    stopPolling(accountID, pollingProcessID);
  }

  handleDownload = () => {
    const { downloadReports, accountID } = this.props;
    downloadReports(accountID);
  };

  handleRestart = () => {
    const { restartProcess, accountID } = this.props;
    restartProcess(accountID);
  };

  handleTabChange = tabName => {
    const { setActiveTab, accountID } = this.props;
    setActiveTab(accountID, tabName);
  };

  render() {
    const { uploading, generating, statuses } = this.props;
    return (
      <NavContainer
        items={[
          {
            icon: 'database',
            name: 'Generating',
            component: ReportGenerate,
            props: {
              ...generating,
              restartProcess: this.handleRestart,
              exitCode: statuses.generate_report_status,
            },
            onClick: () => this.handleTabChange('generating'),
          },
          {
            icon: 'cloud-upload',
            name: 'Uploading',
            component: ReportUpload,
            props: {
              ...uploading,
              restartProcess: this.handleRestart,
              downloadReports: this.handleDownload,
              exitCode: statuses.upload_report_status,
            },
            onClick: () => this.handleTabChange('uploading'),
          },
        ]}
      />
    );
  }
}

Dashboard.propTypes = {
  accountID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
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
  statuses: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
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
  statuses: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
  },
};

export default Dashboard;
