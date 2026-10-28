// The collection-mode dropdown only persists insights_minimal_data_collection.
// Obfuscation toggles keep their stored values. AdvancedSetting draws them
// locked On while Minimal is selected, then shows the stored values again
// when the user returns to Analytics.
export const settingsForDropdownSelection = value => [
  {
    setting: 'insights_minimal_data_collection',
    value: value === 'minimal',
  },
];
