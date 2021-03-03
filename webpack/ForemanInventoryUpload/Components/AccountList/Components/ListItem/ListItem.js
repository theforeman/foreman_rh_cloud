import React from 'react';
import { ListView } from 'patternfly-react';
import PropTypes from 'prop-types';
import ListItemStatus from '../ListItemStatus';
import Dashboard from '../../../Dashboard';

const ListItem = ({ label, account }) => (
  <ListView.Item
    leftContent={<ListView.Icon name="user" />}
    heading={label}
    additionalInfo={[
      <ListItemStatus key={`${label}_status`} account={account} />,
    ]}
    stacked
    hideCloseIcon
  >
    <Dashboard accountID={account.id} account={account} />
  </ListView.Item>
);

ListItem.propTypes = {
  label: PropTypes.string.isRequired,
  account: PropTypes.shape({
    generate_report_status: PropTypes.string,
    upload_report_status: PropTypes.string,
    id: PropTypes.number,
  }),
};

ListItem.defaultProps = {
  account: {
    generate_report_status: 'unknown',
    upload_report_status: 'unknown',
    id: 0,
  },
};

export default ListItem;
