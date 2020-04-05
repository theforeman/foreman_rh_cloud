import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import { handleToggle } from '../AutoUploadSwitcherActions';
import { handleToggleResponse } from '../AutoUploadSwitcher.fixtures';

jest.mock('foremanReact/API');
API.post.mockImplementation(async () => handleToggleResponse);

const fixtures = {
  'should handleToggle': () => handleToggle(),
};

describe('AutoUploadSwitcher actions', () =>
  testActionSnapshotWithFixtures(fixtures));
