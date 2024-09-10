import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateIcon,
  Spinner,
  EmptyStateVariant, EmptyStateHeader,
  } from '@patternfly/react-core';
import { ExclamationCircleIcon, CheckIcon } from '@patternfly/react-icons';

import { STATUS } from 'foremanReact/constants';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

const TableEmptyState = ({ status, error, rowsLength }) => {
  switch (status) {
    case STATUS.PENDING:
      return (
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateHeader titleText={<>{__('Loading')}</>} icon={<EmptyStateIcon  icon={Spinner} />} headingLevel="h2" />
        </EmptyState>
      );
    case STATUS.ERROR:
      return (
        <EmptyState variant={EmptyStateVariant.sm}>
          <EmptyStateHeader titleText={<>{sprintf(__('The server returned the following error: %s'), error)}</>} icon={<EmptyStateIcon
            
            icon={ExclamationCircleIcon}
          />} headingLevel="h2" />
        </EmptyState>
      );
    case STATUS.RESOLVED:
      if (rowsLength > 0) return null;
      return (
        <EmptyState variant={EmptyStateVariant.lg}>
          <EmptyStateHeader titleText={<>{__('There are no recommendations for your hosts')}</>} icon={<EmptyStateIcon  icon={CheckIcon} />} headingLevel="h2" />
        </EmptyState>
      );
    default:
      return null;
  }
};

TableEmptyState.propTypes = {
  status: PropTypes.string,
  error: PropTypes.string,
  rowsLength: PropTypes.number,
};

TableEmptyState.defaultProps = {
  status: '',
  error: '',
  rowsLength: 0,
};

export default TableEmptyState;
