import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { noop, Grid, Button, Icon } from 'patternfly-react';
import './tabHeader.scss';

const TabHeader = ({ exitCode, onRestart, onDownload }) => {
  const restartButton = (
    <Button bsStyle="primary" onClick={onRestart}>
      Restart
    </Button>
  );
  const buttons = onDownload ? (
    <Fragment>
      {restartButton}
      <Button onClick={onDownload}>
        Download Report <Icon name="download" />
      </Button>
    </Fragment>
  ) : (
    restartButton
  );
  return (
    <Grid.Row className="tab-header">
      <Grid.Col sm={7}>
        <p># Exit Code: {exitCode}</p>
      </Grid.Col>
      <Grid.Col sm={5}>
        <div className="tab-action-buttons">{buttons}</div>
      </Grid.Col>
    </Grid.Row>
  );
};

TabHeader.propTypes = {
  onRestart: PropTypes.func,
  onDownload: PropTypes.func,
  exitCode: PropTypes.string,
};

TabHeader.defaultProps = {
  onRestart: noop,
  exitCode: '',
  onDownload: null,
};

export default TabHeader;
