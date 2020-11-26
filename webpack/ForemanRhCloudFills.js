import React from 'react';
import { addGlobalFill } from 'foremanReact/components/common/Fill/GlobalFill';
import InventoryAutoUploadSwitcher from './ForemanInventoryUpload/SubscriptionsPageExtension/InventoryAutoUpload';

const fills = [
  {
    slot: 'katello-manage-manifest-form',
    name: 'InventoryAutoUpload',
    component: () => <InventoryAutoUploadSwitcher />,
    weight: 50,
  },
];

export const registerFills = () => {
  fills.forEach(({ slot, name, component: Component, weight }, index) =>
    addGlobalFill(
      slot,
      name,
      <Component key={`rh-cloud-fill-${index}`} />,
      weight
    )
  );
};
