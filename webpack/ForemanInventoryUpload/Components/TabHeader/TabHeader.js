import React from 'react';
import PropTypes from 'prop-types';
import { noop, Grid, Button, Icon } from 'patternfly-react';
import './tabHeader.scss';

const TabHeader = ({ exitCode, onRestart, onDownload, toggleFullScreen }) => (
  <Grid.Row className="tab-header">
    <Grid.Col sm={6}>
      <p>Exit Code: {exitCode}</p>
    </Grid.Col>
    <Grid.Col sm={6}>
      <div className="tab-action-buttons">
        <Button bsStyle="primary" onClick={onRestart}>
          Restart
        </Button>
        {onDownload ? (
          <Button onClick={onDownload}>
            Download Report <Icon name="download" />
          </Button>
        ) : null}
        <Button onClick={toggleFullScreen}>
          Full Screen
          <Icon name="arrows-alt" />
        </Button>
      </div>
    </Grid.Col>
  </Grid.Row>
);

TabHeader.propTypes = {
  onRestart: PropTypes.func,
  onDownload: PropTypes.func,
  exitCode: PropTypes.string,
  toggleFullScreen: PropTypes.func,
};

TabHeader.defaultProps = {
  onRestart: noop,
  exitCode: '',
  onDownload: null,
  toggleFullScreen: noop,
};

export default TabHeader;
