import React from 'react';
import PropTypes from 'prop-types';
import TabHeader from '../TabHeader/TabHeader';
import Terminal from '../Terminal';
import TabFooter from '../TabFooter';
import ScheduledRun from '../ScheduledRun/ScheduledRun';
import TabContainer from '../TabContainer';
import './reportGenerate.scss';

const ReportGenerate = ({ exitCode }) => (
  <TabContainer className="report-generate">
    <TabHeader exitCode={exitCode} />
    <Terminal />
    <TabFooter>
      <ScheduledRun />
    </TabFooter>
  </TabContainer>
);

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ReportGenerate.defaultProps = {
  exitCode: 0,
};

export default ReportGenerate;
