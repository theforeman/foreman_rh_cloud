import { translate as __ } from 'foremanReact/common/I18n';

export const settingsDict = {
  autoUploadEnabled: {
    name: 'allow_auto_inventory_upload',
    label: __('Automatic inventory upload'),
    tooltip: __(
      'Enable automatic upload of your hosts inventory to the Red Hat cloud'
    ),
  },
  hostObfuscationEnabled: {
    name: 'obfuscate_inventory_hostnames',
    label: __('Obfuscate host names'),
    tooltip: __('Obfuscate host names sent to the Red Hat cloud'),
  },
  ipsObfuscationEnabled: {
    name: 'obfuscate_inventory_ips',
    label: __('Obfuscate host ipv4 addresses'),
    tooltip: __('Obfuscate ipv4 addresses sent to the Red Hat cloud'),
  },
  excludePackagesEnabled: {
    name: 'exclude_installed_packages',
    label: __('Exclude installed Packages'),
    tooltip: __(
      'Exclude installed packages from being uploaded to the Red Hat cloud'
    ),
  },
  allowAutoInsightsMismatchDelete: {
    name: 'allow_auto_insights_mismatch_delete',
    label: __('Automatic mismatch deletion'),
    tooltip: __(
      'Enable automatic deletion of mismatched host records from the Red Hat cloud'
    ),
  },
};
