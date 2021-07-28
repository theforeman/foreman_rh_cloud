import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionLink } from '@patternfly/react-core';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

const SelectAllAlert = ({
  selectedIds,
  showSelectAllAlert,
  selectAll,
  clearAllSelection,
  isAllSelected,
}) => {
  if (!showSelectAllAlert) return null;
  const selectedCount = Object.keys(selectedIds).length;
  if (!selectedCount) return null;
  if (!isAllSelected) {
    return (
      <Alert
        isInline
        variant="info"
        title={sprintf(__('Recommendations selected: %s.'), selectedCount)}
        actionLinks={
          <AlertActionLink onClick={selectAll}>
            {__('Select recommendations from all pages')}
          </AlertActionLink>
        }
      />
    );
  }

  return (
    <Alert
      isInline
      variant="info"
      title={__('All recommendations are now selected.')}
      actionLinks={
        <AlertActionLink onClick={clearAllSelection}>
          {__('Clear Selection')}
        </AlertActionLink>
      }
    />
  );
};

SelectAllAlert.propTypes = {
  selectedIds: PropTypes.object,
  showSelectAllAlert: PropTypes.bool,
  selectAll: PropTypes.func.isRequired,
  clearAllSelection: PropTypes.func.isRequired,
  isAllSelected: PropTypes.bool,
};

SelectAllAlert.defaultProps = {
  selectedIds: {},
  showSelectAllAlert: false,
  isAllSelected: false,
};

export default SelectAllAlert;
