import React from 'react';
import { EmptyState, Icon } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import './emptyResults.scss';

const inventoryEmptyResults = () => (
  <EmptyState>
    <EmptyState.Title>
      <Icon className="no_results_icon" name="meh-o" />
      {__("Oops! Couldn't find organization that matches your query")}
    </EmptyState.Title>
  </EmptyState>
);

export default inventoryEmptyResults;
