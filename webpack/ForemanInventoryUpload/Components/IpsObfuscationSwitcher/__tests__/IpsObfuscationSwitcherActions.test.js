import { testActionSnapshotWithFixtures } from '@theforeman/test';
import API from 'foremanReact/API';
import { handleToggle } from '../IpsObfuscationSwitcherActions';
import { handleToggleResponse } from '../IpsObfuscationSwitcher.fixtures';

jest.mock('foremanReact/API');
API.post.mockImplementation(async () => handleToggleResponse);

const fixtures = {
  'should handleToggle': () => handleToggle(false),
  'should handleError': () => {
    API.post.mockImplementationOnce(() =>
      Promise.reject(new Error('test error'))
    );

    return handleToggle(false);
  },
};

describe('IpsObfuscationSwitcher actions', () =>
  testActionSnapshotWithFixtures(fixtures));
