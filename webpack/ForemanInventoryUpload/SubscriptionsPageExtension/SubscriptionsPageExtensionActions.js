import ReactDom from 'react-dom';
import React from 'react';
import API from 'foremanReact/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from '../../ForemanRhCloudHelpers';
import { inventoryUrl } from '../ForemanInventoryHelpers';

export const subscriptionCountListener = (itemsCount, unsubscribe) => {
  const showToast = autoUploadEnabled => {
    !autoUploadEnabled &&
      window.tfm.toastNotifications.notify({
        message: __('Now you can enable Red Hat inventory upload'),
        type: 'info',
        link: {
          children: __('Go to inventory upload settings'),
          href: foremanUrl('foreman_rh_cloud/inventory_upload'),
        },
      });

    unsubscribe();
  };

  itemsCount && fetchInventoryAutoUploadSetting(showToast);
};

const fetchInventoryAutoUploadSetting = async processApiResponse => {
  let settingValue;
  try {
    const {
      data: { autoUploadEnabled },
    } = await API.get(inventoryUrl('auto_upload'));
    settingValue = autoUploadEnabled;
  } finally {
    processApiResponse(settingValue);
  }
};

export const manifestModalListener = (isOpen, unsubscribe) => {
  if(!isOpen) return;

  const intervalID = setInterval(() => {
    const form = document.querySelector("#manifest-history-tabs-pane-1 > form");
    if(!form) return; // Although modal 'isOpen' was set to true, its DOM wasn't loaded yet.
    clearInterval(intervalID)

    const rhCloudSlot = document.createElement('div')
    rhCloudSlot.id = 'rh_cloud_slot'
    form.insertAdjacentElement('beforeend', rhCloudSlot)

    const switcher = <h1>Hello from RH</h1>; // Replace this with the form-group and the actual switcher.
    ReactDom.render(switcher, document.getElementById('rh_cloud_slot'));
    unsubscribe();
  }, 250) 
}
