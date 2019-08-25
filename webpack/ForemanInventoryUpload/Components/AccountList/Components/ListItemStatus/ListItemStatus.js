import React from 'react';
import { Grid } from 'patternfly-react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import './listItemStatus.scss';
import { getStatusIconByRegex } from './ListItemStatusHelper';

const ListItemStatus = ({ statuses }) => {
  const generatingStatusIcon = getStatusIconByRegex(
    statuses.generate_report_status
  );
  const uploadingStatusIcon = getStatusIconByRegex(
    statuses.upload_report_status
  );
  return (
    <Grid className="status">
      <Grid.Col sm={6} className="item">
        <p>{__('Generating')}</p>
        {generatingStatusIcon}
      </Grid.Col>
      <Grid.Col sm={6} className="item">
        <p>{__('Uploading')}</p>
        {uploadingStatusIcon}
      </Grid.Col>
    </Grid>
  );
};

ListItemStatus.propTypes = {
  statuses: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
};

ListItemStatus.defaultProps = {
  statuses: {
    generate_report_status: 'unknown',
    uploupload_report_statusading: 'unknown',
  },
};

export default ListItemStatus;
