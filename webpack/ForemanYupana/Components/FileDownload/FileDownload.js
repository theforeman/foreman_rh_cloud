import React from 'react';
import PropTypes from 'prop-types';
import { noop, Grid, Button, Icon } from 'patternfly-react';
import './fileDownload.scss';

const FileDownload = ({ onClick }) => (
  <Grid.Col sm={3}>
    <Button onClick={onClick} className="download-button">
      Download Files <Icon name="download" />
    </Button>
  </Grid.Col>
);

FileDownload.propTypes = {
  onClick: PropTypes.func,
};

FileDownload.defaultProps = {
  onClick: noop,
};

export default FileDownload;
