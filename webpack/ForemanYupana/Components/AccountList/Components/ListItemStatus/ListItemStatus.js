import React from 'react';
import { Grid, Icon, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import './listItemStatus.scss';

const ListItemStatus = ({ status }) => {
  const statusIcons = {
    success: <Icon name="check" />,
    failure: <Icon name="times" />,
    running: <Spinner loading inline size="xs" />,
    stopped: <span>--</span>,
  };
  return (
    <Grid className="status">
      <Grid.Col sm={6} className="item">
        <p>Generating</p>
        {statusIcons[status.generating]}
      </Grid.Col>
      <Grid.Col sm={6} className="item">
        <p>Uploading</p>
        {statusIcons[status.uploading]}
      </Grid.Col>
    </Grid>
  );
};

ListItemStatus.propTypes = {
  status: PropTypes.shape({
    generating: PropTypes.string,
    uploading: PropTypes.string,
  }),
};

ListItemStatus.defaultProps = {
  status: {
    generating: 'stopped',
    uploading: 'stopped',
  },
};

export default ListItemStatus;
