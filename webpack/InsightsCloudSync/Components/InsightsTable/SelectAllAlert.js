import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
} from '@patternfly/react-core';

const SelectAllAlert = ({
  selectedIds,
  itemCount,
  showSelectAllAlert,
  onClose,
  selectAll,
  clearAllSelection,
}) => {
  if (!showSelectAllAlert) return null;
  const selectedCount = Object.keys(selectedIds).length;
  if (!selectedCount) return null;
  if (itemCount > selectedCount) {
    return (
      <Alert
        isInline
        variant="info"
        title={`All ${selectedCount} recommendations on this page are selected.`}
        actionClose={<AlertActionCloseButton onClose={onClose} />}
        actionLinks={
          <React.Fragment>
            <AlertActionLink onClick={selectAll}>
              Select all {itemCount} recommendations
            </AlertActionLink>
          </React.Fragment>
        }
      />
    );
  }
  if (itemCount === selectedCount) {
    return (
      <Alert
        isInline
        variant="info"
        title={`All ${selectedCount} recommendations are selected.`}
        actionClose={<AlertActionCloseButton onClose={onClose} />}
        actionLinks={
          <React.Fragment>
            <AlertActionLink onClick={clearAllSelection}>
              Clear Selection
            </AlertActionLink>
          </React.Fragment>
        }
      />
    );
  }
  return null;
};

SelectAllAlert.propTypes = {
  selectedIds: PropTypes.object,
  itemCount: PropTypes.number,
  showSelectAllAlert: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  clearAllSelection: PropTypes.func.isRequired,
};

SelectAllAlert.defaultProps = {
  selectedIds: {},
  itemCount: 0,
  showSelectAllAlert: false,
};

export default SelectAllAlert;
