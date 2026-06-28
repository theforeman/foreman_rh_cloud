import React from 'react';
import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { OutlinedMehIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import './emptyResults.scss';

const inventoryEmptyResults = () => (
  <EmptyState variant={EmptyStateVariant.lg}>
    <EmptyStateIcon icon={OutlinedMehIcon} />
    <EmptyStateHeader
      titleText={
        <>{__("Oops! Couldn't find organization that matches your query")}</>
      }
      headingLevel="h2"
    />
  </EmptyState>
);

export default inventoryEmptyResults;
