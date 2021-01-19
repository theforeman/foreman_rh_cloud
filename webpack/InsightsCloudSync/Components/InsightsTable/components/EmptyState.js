import React from 'react';
import PropTypes from 'prop-types';
import {
  EmptyState,
  EmptyStateIcon,
  Spinner,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { STATUS } from 'foremanReact/constants';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

const TableEmptyState = ({ status, error }) => {
  switch (status) {
    case STATUS.PENDING:
      return (
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon variant="container" component={Spinner} />
          <Title headingLevel="h2" size="lg">
            {__('Loading')}
          </Title>
        </EmptyState>
      );
    case STATUS.ERROR:
      return (
        <EmptyState variant={EmptyStateVariant.small}>
          <EmptyStateIcon
            variant="container"
            component={ExclamationCircleIcon}
          />
          <Title headingLevel="h2" size="lg">
            {sprintf(__('The server returned the following error: %s'), error)}
          </Title>
        </EmptyState>
      );
    default:
      return null;
  }
};

TableEmptyState.propTypes = {
  status: PropTypes.string,
  error: PropTypes.string,
};

TableEmptyState.defaultProps = {
  status: '',
  error: '',
};

export default TableEmptyState;
