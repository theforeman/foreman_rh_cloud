import React from 'react';
import PropTypes from 'prop-types';
import { noop, bindMethods } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import ScheduledRun from '../ScheduledRun';
import TabBody from '../TabBody';
import './reportGenerate.scss';

class ReportGenerate extends React.Component {
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
      processScheduledTime,
      loading,
      logs,
      completed,
    } = this.props;

    return (
      <TabContainer className="report-generate">
        <TabHeader exitCode={exitCode} onRestart={this.handleRestart} />
        <TabBody loading={loading} logs={logs} completed={completed} />
        <TabFooter>
          <ScheduledRun time={processScheduledTime} />
        </TabFooter>
      </TabContainer>
    );
  }
}

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  processScheduledTime: PropTypes.string,
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
};

ReportGenerate.defaultProps = {
  exitCode: 0,
  processScheduledTime: '00:00',
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
};

export default ReportGenerate;
