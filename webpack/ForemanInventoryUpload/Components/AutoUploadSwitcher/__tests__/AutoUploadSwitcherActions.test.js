import { testActionSnapshotWithFixtures } from '@theforeman/test';
import API from 'foremanReact/API';
import { handleToggle } from '../AutoUploadSwitcherActions';
import {
  handleToggleResponse,
  currentAutoUploadEnabled,
} from '../AutoUploadSwitcher.fixtures';

jest.mock('foremanReact/API');
API.post.mockImplementation(async () => handleToggleResponse);

const fixtures = {
  'should handleToggle': () => handleToggle(currentAutoUploadEnabled),
  'should handleToggle with error': () => {
    API.post.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error!'))
    );

    return handleToggle(currentAutoUploadEnabled);
  },
};

describe('AutoUploadSwitcher actions', () =>
  testActionSnapshotWithFixtures(fixtures));
