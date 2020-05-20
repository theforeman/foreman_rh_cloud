import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';
import InventoryFilter from '../index';
import reducers from '../../../../ForemanRhCloudReducers';

describe('InventoryFilter integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const wrapper = integrationTestHelper.mount(<InventoryFilter />);
    const input = wrapper.find('#inventory_filter_input');
    input.simulate('change', { target: { value: 'some_new_filter' } });
    await IntegrationTestHelper.flushAllPromises();
    wrapper.update();
    integrationTestHelper.takeStoreAndLastActionSnapshot(
      'filter have been updated'
    );
  });
});
