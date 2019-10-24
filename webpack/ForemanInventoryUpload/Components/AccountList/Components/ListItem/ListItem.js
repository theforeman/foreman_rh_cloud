import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItemStatus from '../ListItemStatus';
import Dashboard from '../../../Dashboard';

const ListItem = ({ accountID, statuses, initExpanded }) => (
  <ListView.Item
    leftContent={<ListView.Icon name="user" />}
    heading={statuses.label}
    additionalInfo={[
      <ListItemStatus key={`${accountID}_status`} statuses={statuses} />,
    ]}
    stacked
    hideCloseIcon
    initExpanded={initExpanded}
  >
    <Dashboard accountID={accountID} statuses={statuses} />
  </ListView.Item>
);

ListItem.propTypes = {
  accountID: PropTypes.string.isRequired,
  statuses: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
    label: PropTypes.string,
  }),
  initExpanded: PropTypes.bool,
};

ListItem.defaultProps = {
  statuses: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
    label: 'default_org_name',
  },
  initExpanded: false,
};

export default ListItem;
