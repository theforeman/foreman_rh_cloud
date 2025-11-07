import { rhCloudStateWrapper } from '../ForemanRhCloudTestHelpers';
import {
  selectForemanRhCloud,
  selectForemanInventoryUpload,
  selectInsightsCloudSync,
} from '../ForemanRhCloudSelectors';

const state = rhCloudStateWrapper(
  { inventoryChild: {} },
  { insightsChild: {} }
);

describe('ForemanRhCloud selectors', () => {
  it('should return ForemanRhCloud', () => {
    const result = selectForemanRhCloud(state);
    expect(result).toHaveProperty('inventoryUpload');
    expect(result).toHaveProperty('InsightsCloudSync');
  });

  it('should return ForemanInventoryUpload', () => {
    const result = selectForemanInventoryUpload(state);
    expect(result).toHaveProperty('inventoryChild');
  });

  it('should return InsightsCloudSync', () => {
    const result = selectInsightsCloudSync(state);
    expect(result).toHaveProperty('insightsChild');
  });
});
