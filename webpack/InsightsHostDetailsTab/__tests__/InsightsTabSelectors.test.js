import { hostInsightsStateWrapper } from '../../ForemanRhCloudTestHelpers';
import { hits } from './InsightsTab.fixtures';
import { selectHits } from '../InsightsTabSelectors';

const state = hostInsightsStateWrapper({ hits });

describe('InsightsTab selectors', () => {
  it('should return hits', () => {
    expect(selectHits(state)).toEqual(hits);
  });
});
