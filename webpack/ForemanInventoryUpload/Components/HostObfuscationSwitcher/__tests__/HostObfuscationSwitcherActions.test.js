import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import { handleToggle } from '../HostObfuscationSwitcherActions';
import { handleToggleResponse } from '../HostObfuscationSwitcher.fixtures';

jest.mock('foremanReact/API');
API.post.mockImplementation(async () => handleToggleResponse);

const fixtures = {
  'should handleToggle': () => handleToggle(),
};

describe('HostObfuscationSwitcher actions', () =>
  testActionSnapshotWithFixtures(fixtures));
