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
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
  }),
  initExpanded: PropTypes.bool,
};

ListItem.defaultProps = {
  statuses: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
  },
  initExpanded: false,
};

export default ListItem;
