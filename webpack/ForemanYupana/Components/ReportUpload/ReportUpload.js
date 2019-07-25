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

const ReportUpload = ({
  exitCode,
  loading,
  logs,
  completed,
  files,
  downloadReports,
  restartProcess,
  error,
}) => (
  <TabContainer className="report-upload">
    <TabHeader exitCode={exitCode} onRestart={restartProcess} />
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

ReportUpload.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  loading: false,
  logs: ['No running process'],
  completed: 0,
  restartProcess: noop,
  files: [],
  downloadReports: noop,
  error: null,
};

export default ReportUpload;
