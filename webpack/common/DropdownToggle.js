import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownList, MenuToggle } from '@patternfly/react-core';

const DropdownToggle = ({ items, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Dropdown
      ouiaId="toggle-dropdown"
      onSelect={() => setOpen(false)}
      onOpenChange={setOpen}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          variant="plain"
          aria-label="Table actions"
          onClick={() => setOpen(prev => !prev)}
          isExpanded={isOpen}
        />
      )}
      isOpen={isOpen}
      shouldFocusToggleOnSelect
      popperProps={{ position: 'right' }}
      {...props}
    >
      <DropdownList>{items}</DropdownList>
    </Dropdown>
  );
};

DropdownToggle.propTypes = {
  items: PropTypes.array.isRequired,
};

export default DropdownToggle;
