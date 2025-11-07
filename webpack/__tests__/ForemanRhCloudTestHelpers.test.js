import {
  rhCloudStateWrapper,
  inventoryStateWrapper,
  insightsStateWrapper,
} from '../ForemanRhCloudTestHelpers';

describe('ForemanRhCloud helpers', () => {
  it('should return rhCloud wrapper', () => {
    const result = rhCloudStateWrapper({ inventoryChild: {} }, { insightsChild: {} });
    expect(result).toHaveProperty('ForemanRhCloud');
    expect(result.ForemanRhCloud).toHaveProperty('inventoryUpload');
    expect(result.ForemanRhCloud).toHaveProperty('InsightsCloudSync');
  });

  it('should return inventory wrapper', () => {
    const result = inventoryStateWrapper({ inventoryChild: {} });
    expect(result).toHaveProperty('ForemanRhCloud');
    expect(result.ForemanRhCloud).toHaveProperty('inventoryUpload');
  });

  it('should return insights wrapper', () => {
    const result = insightsStateWrapper({ insightsChild: {} });
    expect(result).toHaveProperty('ForemanRhCloud');
    expect(result.ForemanRhCloud).toHaveProperty('InsightsCloudSync');
  });
});
