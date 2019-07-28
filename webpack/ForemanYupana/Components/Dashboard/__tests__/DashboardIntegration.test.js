import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import Dashboard, { reducers } from '../index';

describe('Dashboard integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<Dashboard />);
    component.update();
    /** Create a Flow test */
  });
});
