// Settings saved when the Inventory Upload data collection dropdown changes.
// Minimal mode only updates insights_minimal_data_collection. The obfuscation
// toggles stay as they were, so returning to Analytics shows the previous values.
// The locked On display while Minimal is selected is handled by AdvancedSetting.
// If the page loaded already on Minimal, choosing Analytics turns on any child
// setting that is still off so the upload does not jump to the full data set.
export const settingsForDropdownSelection = ({
  value,
  currentlyMinimal,
  cameFromAnalytics,
  childSettings,
}) => {
  const updates = [
    {
      setting: 'insights_minimal_data_collection',
      value: value === 'minimal',
    },
  ];

  const nextCameFromAnalytics =
    cameFromAnalytics || (value === 'minimal' && !currentlyMinimal);

  if (value === 'optional' && currentlyMinimal && !cameFromAnalytics) {
    childSettings.forEach(({ name, enabled }) => {
      if (!enabled) {
        updates.push({ setting: name, value: true });
      }
    });
  }

  return { updates, cameFromAnalytics: nextCameFromAnalytics };
};
