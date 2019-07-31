import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import AccountList, { reducers } from '../index';

describe('AccountList integration test', () => {
  xit('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<AccountList />);
    component.update();
    /** Create a Flow test */
  });
});
