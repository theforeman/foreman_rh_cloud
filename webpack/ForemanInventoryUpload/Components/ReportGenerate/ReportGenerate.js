import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'foremanReact/common/helpers';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabBody from '../TabBody';
import './reportGenerate.scss';

const ReportGenerate = ({
  exitCode,
  logs,
  completed,
  error,
  restartProcess,
  restartDisconnected,
  toggleFullScreen,
  scheduled,
}) => (
  <TabContainer className="report-generate">
    <TabHeader
      exitCode={exitCode}
      onRestart={restartProcess}
      restartDisconnected={restartDisconnected}
      toggleFullScreen={toggleFullScreen}
    />
    <TabBody
      exitCode={exitCode}
      logs={logs}
      completed={completed}
      error={error}
      scheduled={scheduled}
    />
  </TabContainer>
);

ReportGenerate.propTypes = {
  exitCode: PropTypes.string,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  completed: PropTypes.number,
  error: PropTypes.string,
  restartDisconnected: PropTypes.func,
  restartProcess: PropTypes.func,
  toggleFullScreen: PropTypes.func,
  scheduled: PropTypes.string,
};

ReportGenerate.defaultProps = {
  exitCode: '',
  logs: null,
  completed: 0,
  error: null,
  restartProcess: noop,
  restartDisconnected: noop,
  toggleFullScreen: noop,
  scheduled: null,
};

export default ReportGenerate;
