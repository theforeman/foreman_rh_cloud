import React from 'react';
import PropTypes from 'prop-types';
import { noop, bindMethods } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import TabBody from '../TabBody';
import Tree from '../Tree';
import FileDownload from '../FileDownload';
import './reportUpload.scss';

class ReportUpload extends React.Component {
  constructor(props) {
    super(props);
    bindMethods(this, ['handleRestart']);
  }

  componentDidMount() {
    const { startProcess, startPolling, fetchLogs } = this.props;
    startProcess();
    const pollingProcessID = setInterval(
      () => fetchLogs(pollingProcessID),
      2000
    );
    startPolling(pollingProcessID);
  }

  async handleRestart() {
    const { startProcess, stopProcess, processID, restartProcess } = this.props;
    restartProcess();
    await stopProcess(processID);
    startProcess();
  }

  componentWillUnmount() {
    const { pollingProcessID, stopPolling } = this.props;
    stopPolling(pollingProcessID);
  }

  render() {
    const {
      exitCode,
      loading,
      logs,
      completed,
      files,
      onDownload,
    } = this.props;

    return (
      <TabContainer className="report-upload">
        <TabHeader exitCode={exitCode} onRestart={this.handleRestart} />
        <TabBody loading={loading} logs={logs} completed={completed} />
        <TabFooter>
          <Tree files={files} />
          <FileDownload onClick={onDownload} />
        </TabFooter>
      </TabContainer>
    );
  }
}

ReportUpload.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startProcess: PropTypes.func,
  fetchLogs: PropTypes.func,
  processID: PropTypes.number,
  stopProcess: PropTypes.func,
  loading: PropTypes.bool,
  logs: PropTypes.arrayOf(PropTypes.string),
  completed: PropTypes.number,
  startPolling: PropTypes.func,
  restartProcess: PropTypes.func,
  pollingProcessID: PropTypes.number,
  stopPolling: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.string),
  onDownload: PropTypes.func,
};

ReportUpload.defaultProps = {
  exitCode: 0,
  startProcess: noop,
  fetchLogs: noop,
  processID: 0,
  stopProcess: noop,
  loading: false,
  logs: ['No running process'],
  completed: 0,
  startPolling: noop,
  restartProcess: noop,
  pollingProcessID: 0,
  stopPolling: noop,
  files: [],
  onDownload: noop,
};

export default ReportUpload;
