import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import { fetchHits } from '../InsightsTabActions';
import { hostID, hits } from './InsightsTab.fixtures';

jest.mock('foremanReact/API');
API.get.mockImplementation(async () => hits);

const fixtures = {
  'should fetchHits': () => fetchHits(hostID),
};

describe('InsightsTab actions', () => testActionSnapshotWithFixtures(fixtures));
