import React from 'react';
import { Grid, Icon, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import './listItemStatus.scss';

const ListItemStatus = ({ statuses }) => {
  const statusIcons = {
    success: <Icon name="check" />,
    failure: <Icon name="times" />,
    running: <Spinner loading inline size="xs" />,
    unknown: <span>--</span>,
  };
  return (
    <Grid className="status">
      <Grid.Col sm={6} className="item">
        <p>Generating</p>
        {statusIcons[statuses.generate_report_status]}
      </Grid.Col>
      <Grid.Col sm={6} className="item">
        <p>Uploading</p>
        {statusIcons[statuses.upload_report_status]}
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
