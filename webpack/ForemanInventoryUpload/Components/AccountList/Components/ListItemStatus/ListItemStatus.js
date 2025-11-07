import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { getStatusIconByRegex } from './ListItemStatusHelper';

const ListItemStatus = ({ account }) => {
  const generatedStatusIcon = getStatusIconByRegex(account.generated_status);
  const uploadedStatusIcon = getStatusIconByRegex(account.uploaded_status);
  return (
    <Grid hasGutter className="status">
      <GridItem span={6} className="item">
        <p>{__('Generated')}</p>
        {generatedStatusIcon}
      </GridItem>
      <GridItem span={6} className="item">
        <p>{__('Uploaded')}</p>
        {uploadedStatusIcon}
      </GridItem>
    </Grid>
  );
};

ListItemStatus.propTypes = {
  account: PropTypes.shape({
    generated_status: PropTypes.string,
    uploaded_status: PropTypes.string,
  }),
};

ListItemStatus.defaultProps = {
  account: {
    generated_status: 'unknown',
    uploaded_status: 'unknown',
  },
};

export default ListItemStatus;
