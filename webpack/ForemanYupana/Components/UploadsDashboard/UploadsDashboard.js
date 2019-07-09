import React from 'react';
import {
  TabContainer,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Icon,
} from 'patternfly-react';
import './uploadsDashboard.scss';

const UploadsDashboard = () => (
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
        <TabPane eventKey={1}>Tab 1 content</TabPane>
        <TabPane eventKey={2}>Tab 2 content</TabPane>
      </TabContent>
    </div>
  </TabContainer>
);

export default UploadsDashboard;
