import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import TabBody from '../TabBody';
import Tree from '../Tree';
import FileDownload from '../FileDownload';
import './reportUpload.scss';

class ReportUpload extends React.Component {
  componentDidMount() {
    const { startProcess } = this.props;
    startProcess();
  }

  handleRestart = async () => {
    const { startProcess, stopProcess, processID, restartProcess } = this.props;
    restartProcess();
    await stopProcess(processID);
    startProcess();
  };

  componentWillUnmount() {
    const { stopProcess, processID } = this.props;
    stopProcess(processID);
  }

  render() {
    const {
      exitCode,
      loading,
      logs,
      completed,
      files,
      downloadReports,
      error,
    } = this.props;

    return (
      <TabContainer className="report-upload">
        <TabHeader exitCode={exitCode} onRestart={this.handleRestart} />
        <TabBody
          loading={loading}
          logs={logs}
          completed={completed}
          error={error}
        />
        <TabFooter>
          <Tree files={files} />
          <FileDownload onClick={downloadReports} />
        </TabFooter>
      </TabContainer>
    );
  }
}

ReportUpload.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startProcess: PropTypes.func,
  processID: PropTypes.number,
  stopProcess: PropTypes.func,
  loading: PropTypes.bool,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  completed: PropTypes.number,
  restartProcess: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.string),
  downloadReports: PropTypes.func,
  error: PropTypes.string,
};

ReportUpload.defaultProps = {
  exitCode: 0,
  startProcess: noop,
  processID: 0,
  stopProcess: noop,
  loading: false,
  logs: ['No running process'],
  completed: 0,
  restartProcess: noop,
  files: [],
  downloadReports: noop,
  error: null,
};

export default ReportUpload;
