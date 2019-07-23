import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import ScheduledRun from '../ScheduledRun';
import TabBody from '../TabBody';
import './reportGenerate.scss';

class ReportGenerate extends React.Component {
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
      processScheduledTime,
      loading,
      logs,
      completed,
      error,
    } = this.props;

    return (
      <TabContainer className="report-generate">
        <TabHeader exitCode={exitCode} onRestart={this.handleRestart} />
        <TabBody
          loading={loading}
          logs={logs}
          completed={completed}
          error={error}
        />
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
  processID: PropTypes.number,
  stopProcess: PropTypes.func,
  loading: PropTypes.bool,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  completed: PropTypes.number,
  restartProcess: PropTypes.func,
  error: PropTypes.string,
};

ReportGenerate.defaultProps = {
  exitCode: 0,
  processScheduledTime: '00:00',
  startProcess: noop,
  processID: 0,
  stopProcess: noop,
  loading: false,
  logs: ['No running process'],
  completed: 0,
  restartProcess: noop,
  error: null,
};

export default ReportGenerate;
