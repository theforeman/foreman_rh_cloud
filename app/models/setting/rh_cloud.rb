class Setting::RhCloud < Setting
  ::Setting::BLANK_ATTRS.concat %w{rh_cloud_token}

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
    return unless ActiveRecord::Base.connection.table_exists?('settings')
    [
      set('allow_auto_inventory_upload', N_('Allow automatic upload of the host inventory to the Red Hat cloud'), true, N_('Allow automatic inventory uploads')),
      set('allow_auto_insights_sync', N_('Allow recommendations synchronization from Red Hat cloud'), false, N_('Allow recommendations synchronization')),
      set('obfuscate_inventory_hostnames', N_('Obfuscate host names sent to Red Hat cloud'), false, N_('Obfuscate host names')),
      set('obfuscate_inventory_ips', N_('Obfuscate ip addresses sent to Red Hat cloud'), false, N_('Obfuscate IPs')),
      set('rh_cloud_token', N_('Authentication token to Red Hat cloud services. Used to authenticate requests to cloud APIs'), nil, N_('Red Hat Cloud token'), nil, encrypted: true),
      set('exclude_installed_packages', N_('Exclude installed packages from Red Hat cloud inventory report'), false, N_("Don't upload installed packages")),
    ]
  end

  def self.humanized_category
    N_('RH Cloud')
  end
end
