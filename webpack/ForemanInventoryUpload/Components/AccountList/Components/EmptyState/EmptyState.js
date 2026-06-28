import React from 'react';
import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  Spinner,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import './emptyState.scss';

const inventoryEmptyState = () => (
  <EmptyState variant={EmptyStateVariant.lg}>
    <EmptyStateIcon icon={Spinner} />
    <EmptyStateHeader
      titleText={<>{__('Fetching data about your accounts')}</>}
      headingLevel="h2"
    />
    <EmptyStateBody>{__('Loading...')}</EmptyStateBody>
  </EmptyState>
);

export default inventoryEmptyState;
