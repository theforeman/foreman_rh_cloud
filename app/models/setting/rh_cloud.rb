class Setting::RhCloud < Setting
  ::Setting::BLANK_ATTRS.concat %w{rh_cloud_token, rhc_instance_id}

  def self.load_defaults
    return false unless table_exists?
    transaction do
      # If the user had auto_upload default setting, we will not surprise him, and force the value to false
      # for new users, the default will be set to true and the value will remain nil
      Setting.where(name: 'allow_auto_inventory_upload', value: nil).where("settings.default LIKE '%false%'").update_all(value: "--- false\n...")
      super
    end
  end

  def self.default_settings
    [
      set('allow_auto_inventory_upload', N_('Enable automatic upload of your host inventory to the Red Hat cloud'), true, N_('Automatic inventory upload')),
      set('allow_auto_insights_sync', N_('Enable automatic synchronization of Insights recommendations from the Red Hat cloud'), false, N_('Synchronize recommendations Automatically')),
      set('obfuscate_inventory_hostnames', N_('Obfuscate host names sent to the Red Hat cloud'), false, N_('Obfuscate host names')),
      set('obfuscate_inventory_ips', N_('Obfuscate ipv4 addresses sent to the Red Hat cloud'), false, N_('Obfuscate host ipv4 addresses')),
      set('rh_cloud_token', N_('Authentication token to Red Hat cloud services. Used to authenticate requests to cloud APIs'), nil, N_('Red Hat Cloud token'), nil, encrypted: true),
      set('exclude_installed_packages', N_('Exclude installed packages from being uploaded to the Red Hat cloud'), false, N_("Exclude installed Packages")),
      set('include_parameter_tags', N_('Should import include parameter tags from Foreman?'), false, N_('Include parameters in insights-client reports')),
      set('rhc_instance_id', N_('RHC daemon id'), nil, N_('ID of the RHC(Yiggdrasil) daemon')),
    ]
  end

  def self.humanized_category
    N_('RH Cloud')
  end
end
