import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import ReportUpload, { reducers } from '../index';

describe('ReportUpload integration test', () => {
  xit('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<ReportUpload />);
    component.update();
    /** Create a Flow test */
  });
});
