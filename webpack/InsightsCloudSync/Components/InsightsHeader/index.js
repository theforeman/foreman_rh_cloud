import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import InsightsSettings from '../InsightsSettings';
import './InsightsHeader.scss';

const InsightsHeader = () => (
  <div className="insights-header">
    <InsightsSettings />
    <p>
      {__(`Insights synchronization process is used to provide Insights
             recommendations output for hosts managed here`)}
    </p>
  </div>
);

export default InsightsHeader;
