import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import Terminal, { reducers } from '../index';

describe('Terminal integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<Terminal />);
    component.update();
    /** Create a Flow test */
  });
});
