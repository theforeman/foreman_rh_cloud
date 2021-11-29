import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, KebabToggle } from '@patternfly/react-core';

const DropdownToggle = ({ items, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Dropdown
      onSelect={() => setOpen(false)}
      toggle={<KebabToggle onToggle={value => setOpen(value)} />}
      isOpen={isOpen}
      isPlain
      dropdownItems={items}
      position="right"
      {...props}
    />
  );
};

DropdownToggle.propTypes = {
  items: PropTypes.array.isRequired,
};

export default DropdownToggle;
