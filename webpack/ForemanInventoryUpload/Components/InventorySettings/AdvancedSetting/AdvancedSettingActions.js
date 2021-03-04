import { setSetting } from '../InventorySettingsActions';

export const handleToggle = (name, current) =>
  setSetting({
    setting: name,
    value: !current,
  });
