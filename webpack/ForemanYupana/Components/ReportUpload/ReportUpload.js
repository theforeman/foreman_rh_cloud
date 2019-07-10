import React from 'react';
import PropTypes from 'prop-types';
import TabHeader from '../TabHeader';
import Terminal from '../Terminal';
import Tree from '../Tree';
import './reportUpload.scss';
import TabFooter from '../TabFooter';
import FileDownload from '../FileDownload';
import TabContainer from '../TabContainer';

const ReportUpload = ({ exitCode, files }) => (
  <TabContainer className="report-upload">
    <TabHeader exitCode={exitCode} />
    <Terminal />
    <TabFooter>
      <Tree files={files} />
      <FileDownload />
    </TabFooter>
  </TabContainer>
);

ReportUpload.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  files: PropTypes.arrayOf(PropTypes.string),
};

ReportUpload.defaultProps = {
  exitCode: 0,
  files: [],
};

export default ReportUpload;
