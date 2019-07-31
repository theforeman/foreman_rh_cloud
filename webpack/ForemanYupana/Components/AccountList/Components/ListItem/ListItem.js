import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItemStatus from '../ListItemStatus/ListItemStatus';
import Dashboard from '../../../Dashboard';

const ListItem = ({ name, status, initExpanded }) => (
  <ListView.Item
    leftContent={<ListView.Icon name="user" />}
    heading={name}
    additionalInfo={[<ListItemStatus key={`${name}_status`} status={status} />]}
    stacked
    hideCloseIcon
    initExpanded={initExpanded}
  >
    <Dashboard id={name} />
  </ListView.Item>
);

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.shape({
    generating: PropTypes.string,
    uploading: PropTypes.string,
  }),
  initExpanded: PropTypes.bool,
};

ListItem.defaultProps = {
  status: {
    generating: 'stopped',
    uploading: 'stopped',
  },
  initExpanded: false,
};

export default ListItem;
