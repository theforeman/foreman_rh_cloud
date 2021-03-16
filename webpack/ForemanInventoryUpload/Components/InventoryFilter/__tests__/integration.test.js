import React from 'react';
import { IntegrationTestHelper } from '@theforeman/test';
import InventoryFilter from '../index';
import reducers from '../../../../ForemanRhCloudReducers';

describe('InventoryFilter integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const wrapper = integrationTestHelper.mount(<InventoryFilter />);
    const input = wrapper.find('input[id="inventory_filter_input"]');
    input.simulate('change', { target: { value: 'some_new_filter' } });
    await IntegrationTestHelper.flushAllPromises();
    wrapper.update();
    integrationTestHelper.takeStoreAndLastActionSnapshot(
      'filter have been updated'
    );
  });
});
