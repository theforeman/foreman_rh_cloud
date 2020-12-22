import React from 'react';
import { useSelector } from 'react-redux';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import { selectError } from '../InsightsCloudSyncSelectors';

export const ErrorEmptyState = () => {
  const error = useSelector(selectError);
  return (
    <EmptyState variant={EmptyStateVariant.xl}>
      <EmptyStateIcon icon={ExclamationCircleIcon} />
      <EmptyStateBody>
        <p>
          {sprintf(
            __(
              'Something went wrong while getting the data, the server returned the following error: %s'
            ),
            error
          )}
        </p>
      </EmptyStateBody>
    </EmptyState>
  );
};
