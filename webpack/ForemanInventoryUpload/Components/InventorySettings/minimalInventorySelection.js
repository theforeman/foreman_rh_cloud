// The collection-mode dropdown only persists insights_minimal_data_collection.
// Obfuscation toggles keep their stored values. They are hidden while Minimal
// is selected, then shown again from those stored values when the user
// returns to Analytics.
export const settingsForDropdownSelection = value => [
  {
    setting: 'insights_minimal_data_collection',
    value: value === 'minimal',
  },
];
