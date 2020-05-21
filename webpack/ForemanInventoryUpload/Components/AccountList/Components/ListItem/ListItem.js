import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItemStatus from '../ListItemStatus';
import Dashboard from '../../../Dashboard';

const ListItem = ({ accountID, account }) => (
  <ListView.Item
    leftContent={<ListView.Icon name="user" />}
    heading={account.label}
    additionalInfo={[
      <ListItemStatus key={`${accountID}_status`} account={account} />,
    ]}
    stacked
    hideCloseIcon
  >
    <Dashboard accountID={accountID} account={account} />
  </ListView.Item>
);

ListItem.propTypes = {
  accountID: PropTypes.string.isRequired,
  account: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
    label: PropTypes.string,
  }),
};

ListItem.defaultProps = {
  account: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
    label: 'default_org_name',
  },
};

export default ListItem;
