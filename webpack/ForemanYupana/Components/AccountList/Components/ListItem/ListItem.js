import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItemStatus from '../ListItemStatus';
import Dashboard from '../../../Dashboard';

const ListItem = ({ name, statuses, initExpanded }) => (
  <ListView.Item
    leftContent={<ListView.Icon name="user" />}
    heading={name}
    additionalInfo={[
      <ListItemStatus key={`${name}_status`} statuses={statuses} />,
    ]}
    stacked
    hideCloseIcon
    initExpanded={initExpanded}
  >
    <Dashboard accountID={name} statuses={statuses} />
  </ListView.Item>
);

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
  statuses: PropTypes.shape({
    generating: PropTypes.string,
    uploading: PropTypes.string,
  }),
  initExpanded: PropTypes.bool,
};

ListItem.defaultProps = {
  statuses: {
    generating: 'unknown',
    uploading: 'unknown',
  },
  initExpanded: false,
};

export default ListItem;
