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
        {statusIcons[statuses.generating]}
      </Grid.Col>
      <Grid.Col sm={6} className="item">
        <p>Uploading</p>
        {statusIcons[statuses.uploading]}
      </Grid.Col>
    </Grid>
  );
};

ListItemStatus.propTypes = {
  statuses: PropTypes.shape({
    generating: PropTypes.string,
    uploading: PropTypes.string,
  }),
};

ListItemStatus.defaultProps = {
  statuses: {
    generating: 'unknown',
    uploading: 'unknown',
  },
};

export default ListItemStatus;
