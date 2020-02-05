import React from 'react';
import { IntegrationTestHelper } from '@theforeman/test';

import AccountList from '../index';
import reducers from '../../../ForemanInventoryUploadReducers';

describe('AccountList integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<AccountList />);
    component.update();
    /** Create a Flow test */
  });
});
