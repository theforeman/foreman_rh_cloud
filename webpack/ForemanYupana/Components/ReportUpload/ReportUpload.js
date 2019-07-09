import React from 'react';
import Tree from 'react-animated-tree';
import { Button, Icon, Grid } from 'patternfly-react';
import PropTypes from 'prop-types';
import './reportUpload.scss';

const ReportUpload = ({ exitCode }) => (
  <div className="report-upload">
    <Grid fluid>
      <Grid.Row className="tab-header">
        <Grid.Col sm={4}>
          <h1># Exit Code: {exitCode}</h1>
        </Grid.Col>
        <Grid.Col sm={4} smOffset={4}>
          <Button bsStyle="primary">Restart</Button>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col sm={12}>
          <div className="terminal">
            <Grid fluid>
              <Grid.Row>
                <Grid.Col sm={12}>
                  <p>Generating...</p>
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </div>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <div className="tab-footer">
          <Grid.Col sm={9}>
            <Tree content="Reports" open canHide visible>
              <Tree content="10917891726287" />
              <Tree content="54546578333223" />
              <Tree content="87349928940012" />
              <Tree content="29812389900028" />
              <Tree content="45893458039458" />
              <Tree content="23434556456754" />
            </Tree>
          </Grid.Col>
          <Grid.Col sm={3}>
            <Button>
              Download Files <Icon name="download" />
            </Button>
          </Grid.Col>
        </div>
      </Grid.Row>
    </Grid>
  </div>
);

ReportUpload.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ReportUpload.defaultProps = {
  exitCode: 0,
};

export default ReportUpload;
