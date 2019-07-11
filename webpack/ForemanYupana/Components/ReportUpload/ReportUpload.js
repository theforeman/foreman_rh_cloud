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

const ReportUpload = ({ exitCode, files, logs, onRestart, onDownload }) => (
  <TabContainer className="report-upload">
    <TabHeader exitCode={exitCode} onRestart={onRestart} />
    <TabBody>{logs}</TabBody>
    <TabFooter>
      <Tree files={files} />
      <FileDownload onClick={onDownload} />
    </TabFooter>
  </TabContainer>
);

ReportUpload.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  files: PropTypes.arrayOf(PropTypes.string),
  logs: PropTypes.arrayOf(PropTypes.string),
  onRestart: PropTypes.func,
  onDownload: PropTypes.func,
};

ReportUpload.defaultProps = {
  exitCode: 0,
  files: [],
  logs: ['No running process'],
  onRestart: noop,
  onDownload: noop,
};

export default ReportUpload;
