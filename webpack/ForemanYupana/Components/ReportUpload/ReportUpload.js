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
    const { startProcess } = this.props;
    startProcess();
  }

  async handleRestart() {
    const { startProcess, stopProcess, processID, restartProcess } = this.props;
    restartProcess();
    await stopProcess(processID);
    startProcess();
  }

  render() {
    const {
      exitCode,
      loading,
      logs,
      completed,
      files,
      downloadReports,
    } = this.props;

    return (
      <TabContainer className="report-upload">
        <TabHeader exitCode={exitCode} onRestart={this.handleRestart} />
        <TabBody loading={loading} logs={logs} completed={completed} />
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
  logs: PropTypes.arrayOf(PropTypes.string),
  completed: PropTypes.number,
  restartProcess: PropTypes.func,
  files: PropTypes.arrayOf(PropTypes.string),
  downloadReports: PropTypes.func,
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
};

export default ReportUpload;
