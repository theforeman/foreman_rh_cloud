import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'patternfly-react';
import TabContainer from '../TabContainer';
import TabHeader from '../TabHeader';
import TabFooter from '../TabFooter';
import ScheduledRun from '../ScheduledRun';
import './reportGenerate.scss';
import TabBody from '../TabBody';

const ReportGenerate = ({ exitCode, onRestart, processScheduledTime }) => (
  <TabContainer className="report-generate">
    <TabHeader exitCode={exitCode} onRestart={onRestart} />
    <TabBody />
    <TabFooter>
      <ScheduledRun time={processScheduledTime} />
    </TabFooter>
  </TabContainer>
);

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onRestart: PropTypes.func,
  processScheduledTime: PropTypes.string,
};

ReportGenerate.defaultProps = {
  exitCode: 0,
  onRestart: noop,
  processScheduledTime: '00:00',
};

export default ReportGenerate;
