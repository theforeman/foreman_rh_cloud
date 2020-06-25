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
