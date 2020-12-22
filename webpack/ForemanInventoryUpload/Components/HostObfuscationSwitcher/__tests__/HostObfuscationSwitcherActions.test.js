import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { API } from 'foremanReact/redux/API';
import { handleToggle } from '../HostObfuscationSwitcherActions';
import {
  handleToggleResponse,
  currentHostObfuscationEnabled,
} from '../HostObfuscationSwitcher.fixtures';

jest.mock('foremanReact/redux/API');
API.post.mockImplementation(async () => handleToggleResponse);

const fixtures = {
  'should handleToggle': () => handleToggle(currentHostObfuscationEnabled),
  'should handleToggle with error': () => {
    API.post.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error!'))
    );

    return handleToggle(currentHostObfuscationEnabled);
  },
};

describe('HostObfuscationSwitcher actions', () =>
  testActionSnapshotWithFixtures(fixtures));
