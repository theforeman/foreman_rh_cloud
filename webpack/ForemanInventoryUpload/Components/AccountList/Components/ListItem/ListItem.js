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

const ListItem = ({ label, account, defaultExpanded, onTaskStart }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
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
        <Dashboard
          accountID={account.id}
          account={account}
          onTaskStart={onTaskStart}
        />
      </AccordionContent>
    </AccordionItem>
  );
};

ListItem.propTypes = {
  label: PropTypes.string.isRequired,
  account: PropTypes.shape({
    generated_status: PropTypes.string,
    uploaded_status: PropTypes.string,
    id: PropTypes.number,
  }),
  defaultExpanded: PropTypes.bool,
  onTaskStart: PropTypes.func,
};

ListItem.defaultProps = {
  account: {
    generated_status: 'unknown',
    uploaded_status: 'unknown',
    id: 0,
  },
  defaultExpanded: false,
  onTaskStart: null,
};

export default ListItem;
