import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import ReportGenerate, { reducers } from '../index';

describe('ReportGenerate integration test', () => {
  xit('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<ReportGenerate />);
    component.update();
    /** Create a Flow test */
  });
});
