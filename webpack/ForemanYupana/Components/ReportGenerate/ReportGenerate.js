import React from 'react';
import { Button, Icon, Grid } from 'patternfly-react';
import PropTypes from 'prop-types';
import './reportGenerate.scss';

const ReportGenerate = ({ exitCode }) => (
  <div className="report-generate">
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
        <Grid.Col sm={12}>
          <div className="tab-footer">
            <p>
              <Icon name="calendar" size="2x" />
              Next report generating is schedule to run at 23:30
            </p>
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  </div>
);

ReportGenerate.propTypes = {
  exitCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ReportGenerate.defaultProps = {
  exitCode: 0,
};

export default ReportGenerate;
