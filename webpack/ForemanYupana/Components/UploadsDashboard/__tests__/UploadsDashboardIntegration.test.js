import React from 'react';
import { combineReducers } from 'redux';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import UploadsDashboard, { reducers } from '../index';

const modifiedReducers = {
  ForemanYupana: combineReducers({
    ...reducers,
  }),
};

describe('UploadsDashboard integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(modifiedReducers);
    const component = integrationTestHelper.mount(<UploadsDashboard />);
    component.update();
    /** Create a Flow test */
  });
});
