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

const ListItem = ({ label, account }) => {
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
          {label}
        </span>
        <ListItemStatus key={`${label}_status`} account={account} />
      </AccordionToggle>
      <AccordionContent isHidden={!isExpanded}>
        <Dashboard accountID={account.id} account={account} />
      </AccordionContent>
    </AccordionItem>
  );
};

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
