import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'foremanReact/common/helpers';
import { Tooltip, Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

const ClearButton = ({ onClear }) => (
  <Tooltip content={__('Clear')} position="top">
    <Button
      variant="plain"
      className="inventory-clear-button"
      onClick={onClear}
      aria-label={__('Clear')}
      ouiaId="inventory-clear-button"
    >
      <TimesIcon />
    </Button>
  </Tooltip>
);

ClearButton.propTypes = {
  onClear: PropTypes.func,
};

ClearButton.defaultProps = {
  onClear: noop,
};

export default ClearButton;
