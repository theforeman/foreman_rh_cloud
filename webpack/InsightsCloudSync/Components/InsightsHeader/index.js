import React from 'react';
import { Text, TextVariants } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import './InsightsHeader.scss';

const InsightsHeader = () => (
  <div className="insights-header">
    <Text component={TextVariants.p}>
      {__(
        'Insights synchronization process is used to provide Insights recommendations output for hosts managed here.'
      )}
    </Text>
  </div>
);

export default InsightsHeader;
