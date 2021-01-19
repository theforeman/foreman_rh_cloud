import React, { useState } from 'react';
import {
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Label,
} from '@patternfly/react-core';
import { UserIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import ListItemStatus from '../ListItemStatus';
import Dashboard from '../../../Dashboard';

const ListItem = ({ accountID, account }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <AccordionItem>
      <AccordionToggle
        onClick={() => setIsExpanded(currentValue => !currentValue)}
        isExpanded={isExpanded}
      >
        <span>
          <Label
            className="account-icon"
            variant="outline"
            color="blue"
            icon={<UserIcon />}
          />
          {account.label}
        </span>
        <ListItemStatus key={`${accountID}_status`} account={account} />
      </AccordionToggle>
      <AccordionContent isHidden={!isExpanded}>
        <Dashboard accountID={accountID} account={account} />
      </AccordionContent>
    </AccordionItem>
  );
};

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
