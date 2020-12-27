import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

export const HelpLabel = ({ text, id, className }) => {
  if (!text) return null;
  return (
    <Popover id={`${id}-help`} bodyContent={text} aria-label="help-text">
      <button
        onClick={e => e.preventDefault()}
        className={`pf-c-form__group-label-help ${className}`}
      >
        <HelpIcon noVerticalAlign />
      </button>
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
