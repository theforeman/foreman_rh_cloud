import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import { handleToggle } from '../ExcludePackagesSwitcherActions';
import { handleToggleResponse } from '../ExcludePackagesSwitcher.fixtures';

jest.mock('foremanReact/API');
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
