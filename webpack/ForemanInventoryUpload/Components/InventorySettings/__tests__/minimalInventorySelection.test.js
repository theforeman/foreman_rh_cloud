import { settingsForDropdownSelection } from '../minimalInventorySelection';

const childSettings = [
  { name: 'obfuscate_inventory_hostnames', enabled: false },
  { name: 'obfuscate_inventory_ips', enabled: false },
  { name: 'exclude_installed_packages', enabled: true },
];

describe('settingsForDropdownSelection', () => {
  it('leaves child settings unchanged when moving from analytics to minimal', () => {
    const result = settingsForDropdownSelection({
      value: 'minimal',
      currentlyMinimal: false,
      cameFromAnalytics: false,
      childSettings,
    });

    expect(result.updates).toEqual([
      { setting: 'insights_minimal_data_collection', value: true },
    ]);
    expect(result.cameFromAnalytics).toBe(true);
  });

  it('does not rewrite child settings when returning to analytics in the same visit', () => {
    const result = settingsForDropdownSelection({
      value: 'optional',
      currentlyMinimal: true,
      cameFromAnalytics: true,
      childSettings,
    });

    expect(result.updates).toEqual([
      { setting: 'insights_minimal_data_collection', value: false },
    ]);
    expect(result.cameFromAnalytics).toBe(true);
  });

  it('turns on child settings that are still off when leaving a page loaded on minimal', () => {
    const result = settingsForDropdownSelection({
      value: 'optional',
      currentlyMinimal: true,
      cameFromAnalytics: false,
      childSettings,
    });

    expect(result.updates).toEqual([
      { setting: 'insights_minimal_data_collection', value: false },
      { setting: 'obfuscate_inventory_hostnames', value: true },
      { setting: 'obfuscate_inventory_ips', value: true },
    ]);
    expect(result.cameFromAnalytics).toBe(false);
  });

  it('does not rewrite child settings that are already on', () => {
    const result = settingsForDropdownSelection({
      value: 'optional',
      currentlyMinimal: true,
      cameFromAnalytics: false,
      childSettings: childSettings.map(setting => ({
        ...setting,
        enabled: true,
      })),
    });

    expect(result.updates).toEqual([
      { setting: 'insights_minimal_data_collection', value: false },
    ]);
  });
});
