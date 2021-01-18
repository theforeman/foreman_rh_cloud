import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { getStatusIconByRegex } from './ListItemStatusHelper';

const ListItemStatus = ({ account }) => {
  const generatingStatusIcon = getStatusIconByRegex(
    account.generate_report_status
  );
  const uploadingStatusIcon = getStatusIconByRegex(
    account.upload_report_status
  );
  return (
    <Grid hasGutter className="status">
      <GridItem span={6} className="item">
        <p>{__('Generating')}</p>
        {generatingStatusIcon}
      </GridItem>
      <GridItem span={6} className="item">
        <p>{__('Uploading')}</p>
        {uploadingStatusIcon}
      </GridItem>
    </Grid>
  );
};

ListItemStatus.propTypes = {
  account: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
};

ListItemStatus.defaultProps = {
  account: {
    generate_report_status: 'unknown',
    uploupload_report_statusading: 'unknown',
  },
};

export default ListItemStatus;
