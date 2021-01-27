import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InventorySettings from './InventorySettings';
import { selectRHInventoryEnabled } from './InventorySettingsSelectors';
import {
  getSettings,
  handleToggleRHInventory,
} from './InventorySettingsActions';

const ConnectedInventorySettings = () => {
  const rhInventory = useSelector(store => selectRHInventoryEnabled(store));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  return (
    <InventorySettings
      handleToggleRHInventory={() =>
        dispatch(handleToggleRHInventory(rhInventory))
      }
      rhInventory={rhInventory}
    />
  );
};

export default ConnectedInventorySettings;
