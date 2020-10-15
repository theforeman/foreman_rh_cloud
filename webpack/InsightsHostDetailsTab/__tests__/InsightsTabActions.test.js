import { testActionSnapshotWithFixtures } from '@theforeman/test';
import API from 'foremanReact/API';
import { fetchHits } from '../InsightsTabActions';
import { hostID, hits } from './InsightsTab.fixtures';

jest.mock('foremanReact/API');
API.get.mockImplementation(async () => ({ data: { hits } }));

const fixtures = {
  'should fetchHits': () => fetchHits(hostID),
  'should fetchHits with error': () => {
    API.get.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error!'))
    );
    return fetchHits(hostID);
  },
};

describe('InsightsTab actions', () => testActionSnapshotWithFixtures(fixtures));
