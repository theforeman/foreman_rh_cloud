import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionLink } from '@patternfly/react-core';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

const SelectAllAlert = ({
  selectedIds,
  itemCount,
  showSelectAllAlert,
  selectAll,
  clearAllSelection,
  isAllSelected,
}) => {
  if (!showSelectAllAlert) return null;
  const selectedCount = Object.keys(selectedIds).length;
  if (!selectedCount) return null;
  if (!isAllSelected && selectedCount !== itemCount) {
    return (
      <Alert
        isInline
        variant="info"
        title={sprintf(
          'All %s recommendations on this page are selected.',
          selectedCount
        )}
        actionLinks={
          <AlertActionLink onClick={selectAll}>
            {sprintf('Select all %s recommendations', itemCount)}
          </AlertActionLink>
        }
      />
    );
  }

  return (
    <Alert
      isInline
      variant="info"
      title={sprintf('All %s recommendations are selected.', itemCount)}
      actionLinks={
        <React.Fragment>
          <AlertActionLink onClick={clearAllSelection}>
            {__('Clear Selection')}
          </AlertActionLink>
        </React.Fragment>
      }
    />
  );
};

SelectAllAlert.propTypes = {
  selectedIds: PropTypes.object,
  itemCount: PropTypes.number,
  showSelectAllAlert: PropTypes.bool,
  selectAll: PropTypes.func.isRequired,
  clearAllSelection: PropTypes.func.isRequired,
  isAllSelected: PropTypes.bool,
};

SelectAllAlert.defaultProps = {
  selectedIds: {},
  itemCount: 0,
  showSelectAllAlert: false,
  isAllSelected: false,
};

export default SelectAllAlert;
