import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import InventorySettings from './InventorySettings';
import { getSettings } from './InventorySettingsActions';

const ConnectedInventorySettings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  return <InventorySettings />;
};

export default ConnectedInventorySettings;
