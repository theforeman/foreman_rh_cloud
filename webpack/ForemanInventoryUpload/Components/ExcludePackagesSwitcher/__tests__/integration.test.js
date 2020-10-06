import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import ExcludePackagesSwitcher from '../index';
import reducers from '../../../../ForemanRhCloudReducers';

global.URL_PREFIX = '';

jest.mock('foremanReact/API');
API.post.mockImplementation(async () => ({
  data: {
    excludePackages: false,
  },
}));

jest.mock('../../AccountList/AccountListSelectors', () => ({
  selectExcludePackages: jest.fn(() => true),
}));

describe('ExcludePackagesSwitcher integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const wrapper = integrationTestHelper.mount(<ExcludePackagesSwitcher />);
    const switcher = wrapper.find('Switch').first();
    switcher.props().onChange();
    await IntegrationTestHelper.flushAllPromises();
    wrapper.update();
    integrationTestHelper.takeStoreAndLastActionSnapshot(
      'switcher was toggled'
    );
    expect(API.post).toBeCalledWith(
      '/foreman_inventory_upload/installed_packages_inclusion',
      {
        value: false,
      }
    );
  });
});
