import { settingsForDropdownSelection } from '../minimalInventorySelection';

describe('settingsForDropdownSelection', () => {
  it('enables minimal data collection without changing obfuscation toggles', () => {
    expect(settingsForDropdownSelection('minimal')).toEqual([
      { setting: 'insights_minimal_data_collection', value: true },
    ]);
  });

  it('returns to analytics data collection without changing obfuscation toggles', () => {
    expect(settingsForDropdownSelection('optional')).toEqual([
      { setting: 'insights_minimal_data_collection', value: false },
    ]);
  });
});
