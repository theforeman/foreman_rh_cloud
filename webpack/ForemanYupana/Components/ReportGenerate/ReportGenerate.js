import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import Terminal from '../Terminal';
import ScheduledRun from '../ScheduledRun';
import './reportGenerate.scss';

const ReportGenerate = ({
  exitCode,
  logs,
  onRestart,
  processScheduledTime,
}) => (
  <TabContainer className="report-generate">
    <TabHeader exitCode={exitCode} onRestart={onRestart} />
    <Terminal>{logs}</Terminal>
    <TabFooter>
      <ScheduledRun time={processScheduledTime} />
    </TabFooter>
  </TabContainer>
);

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logs: PropTypes.arrayOf(PropTypes.string),
  onRestart: PropTypes.func,
  processScheduledTime: PropTypes.string,
};

ReportGenerate.defaultProps = {
  exitCode: 0,
  logs: ['No running process'],
  onRestart: noop,
  processScheduledTime: '00:00',
};

export default ReportGenerate;
