import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

export const HelpLabel = ({ text, id, className }) => {
  if (!text) return null;

  return (
    <Popover id={`${id}-help`} bodyContent={text} aria-label="help-text">
      <Button
        variant="plain"
        ouiaId={`help-button-${id}`}
        className={className}
      >
        <HelpIcon />
      </Button>
    </Popover>
  );
};

HelpLabel.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
};
HelpLabel.defaultProps = {
  text: '',
  className: '',
};

export default HelpLabel;
