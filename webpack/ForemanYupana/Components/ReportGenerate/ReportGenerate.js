import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabBody from '../TabBody';
import './reportGenerate.scss';

const ReportGenerate = ({
  exitCode,
  loading,
  logs,
  completed,
  error,
  restartProcess,
}) => (
  <TabContainer className="report-generate">
    <TabHeader exitCode={exitCode} onRestart={restartProcess} />
    <TabBody
      loading={loading}
      logs={logs}
      completed={completed}
      error={error}
    />
  </TabContainer>
);

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  logs: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  completed: PropTypes.number,
  error: PropTypes.string,
  restartProcess: PropTypes.func,
};

ReportGenerate.defaultProps = {
  exitCode: 0,
  loading: false,
  logs: ['No running process'],
  completed: 0,
  error: null,
  restartProcess: noop,
};

export default ReportGenerate;
