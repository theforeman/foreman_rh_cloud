import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
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
    const { restartProcess, accountID, activeTab } = this.props;
    restartProcess(accountID, activeTab);
  };

  handleTabChange = async tabName => {
    const { setActiveTab, accountID, fetchLogs } = this.props;
    await setActiveTab(accountID, tabName);
    fetchLogs(accountID);
  };

  handleToggleFullScreen = () => {
    const { toggleFullScreen, accountID } = this.props;
    toggleFullScreen(accountID);
  };

  render() {
    const {
      uploading,
      generating,
      account,
      showFullScreen,
      activeTab,
    } = this.props;
    return (
      <NavContainer
        items={[
          {
            icon: 'database',
            name: __('Generating'),
            component: ReportGenerate,
            props: {
              ...generating,
              restartProcess: this.handleRestart,
              exitCode: account.generate_report_status,
              toggleFullScreen: this.handleToggleFullScreen,
            },
            onClick: () => this.handleTabChange('generating'),
          },
          {
            icon: 'cloud-upload',
            name: __('Uploading'),
            component: ReportUpload,
            props: {
              ...uploading,
              restartProcess: this.handleRestart,
              downloadReports: this.handleDownload,
              exitCode: account.upload_report_status,
              toggleFullScreen: this.handleToggleFullScreen,
            },
            onClick: () => this.handleTabChange('uploading'),
          },
        ]}
        toggleFullScreen={this.handleToggleFullScreen}
        showFullScreen={showFullScreen}
        terminalProps={this.props[activeTab]}
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
  account: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
  showFullScreen: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  activeTab: PropTypes.string,
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
  account: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
  },
  showFullScreen: false,
  toggleFullScreen: noop,
  activeTab: 'generating',
};

export default Dashboard;
