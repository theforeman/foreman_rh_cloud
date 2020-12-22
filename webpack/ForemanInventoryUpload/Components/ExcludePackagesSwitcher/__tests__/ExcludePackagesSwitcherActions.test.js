import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { API } from 'foremanReact/redux/API';
import { handleToggle } from '../ExcludePackagesSwitcherActions';
import { handleToggleResponse } from '../ExcludePackagesSwitcher.fixtures';

jest.mock('foremanReact/redux/API');
API.post.mockImplementation(async () => handleToggleResponse);

const fixtures = {
  'should handleToggle': () => handleToggle(),
  'should invoke toast notification upon failure of handleToggle': () => {
    API.post.mockImplementationOnce(() =>
      Promise.reject(new Error('test error'))
    );

    return handleToggle();
  },
};

describe('ExcludePackagesSwitcher actions', () =>
  testActionSnapshotWithFixtures(fixtures));
