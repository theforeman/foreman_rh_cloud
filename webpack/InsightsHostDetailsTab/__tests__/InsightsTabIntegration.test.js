import React from 'react';
import { IntegrationTestHelper } from '@theforeman/test';

import InsightsTab from '../index';
import reducers from '../../ForemanRhCloudReducers';
import { hostID } from './InsightsTab.fixtures';

describe('InsightsTab integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(
      <InsightsTab hostID={hostID} />
    );
    component.update();
    /** Create a Flow test */
  });
});
