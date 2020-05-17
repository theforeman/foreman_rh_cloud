import React from 'react';
import PropTypes from 'prop-types';
import { Icon, OverlayTrigger, Tooltip, noop } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';

const ClearButton = ({ onClear }) => (
  <OverlayTrigger
    overlay={
      <Tooltip id="inventory_filter_clear_overlay">{__('Clear')}</Tooltip>
    }
    placement="top"
    trigger={['hover', 'focus']}
  >
    <Icon name="close" className="inventory-clear-button" onClick={onClear} />
  </OverlayTrigger>
);

ClearButton.propTypes = {
  onClear: PropTypes.func,
};

ClearButton.defaultProps = {
  onClear: noop,
};

export default ClearButton;
