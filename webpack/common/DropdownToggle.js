import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownList, MenuToggle } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

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
          aria-label={__('Table actions')}
          onClick={() => setOpen(prev => !prev)}
          isExpanded={isOpen}
          ouiaId="toggle-dropdown-toggle"
        >
          <EllipsisVIcon />
        </MenuToggle>
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
