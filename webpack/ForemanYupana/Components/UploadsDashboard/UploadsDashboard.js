import React from 'react';
import PropTypes from 'prop-types';
import {
  TabContainer,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Icon,
  noop,
} from 'patternfly-react';
import ReportGenerate from '../ReportGenerate';
import ReportUpload from '../ReportUpload';
import './uploadsDashboard.scss';

const UploadsDashboard = ({ generating, uploading }) => (
  <TabContainer id="basic-tabs-pf" defaultActiveKey={1}>
    <div className="uploads-dashboard">
      <Nav bsClass="nav nav-tabs nav-tabs-pf nav-justified">
        <NavItem eventKey={1}>
          <Icon name="database" size="2x" />
          <p>Generating</p>
        </NavItem>
        <NavItem eventKey={2}>
          <Icon name="cloud-upload" size="2x" />
          <p>Uploading</p>
        </NavItem>
      </Nav>
      <TabContent animation>
        <TabPane eventKey={1}>
          <ReportGenerate {...generating} />
        </TabPane>
        <TabPane eventKey={2}>
          <ReportUpload {...uploading} />
        </TabPane>
      </TabContent>
    </div>
  </TabContainer>
);

UploadsDashboard.propTypes = {
  generating: PropTypes.shape({
    exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    logs: PropTypes.arrayOf(PropTypes.string),
    onRestart: PropTypes.func,
    processScheduledTime: PropTypes.string,
  }),
  uploading: PropTypes.shape({
    exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    files: PropTypes.arrayOf(PropTypes.string),
    logs: PropTypes.arrayOf(PropTypes.string),
    onRestart: PropTypes.func,
    onDownload: PropTypes.func,
  }),
};

UploadsDashboard.defaultProps = {
  generating: {
    exitCode: 0,
    logs: ['No running process'],
    processScheduledTime: '00:00',
    onRestart: noop,
  },
  uploading: {
    exitCode: 0,
    files: ['213783213', '213213213', '101763276', '12387892712'],
    logs: ['No running process'],
    onRestart: noop,
    onDownload: noop,
  },
};

export default UploadsDashboard;
