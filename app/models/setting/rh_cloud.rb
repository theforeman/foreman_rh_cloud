class Setting::RhCloud < Setting
  def self.default_settings
    return unless ActiveRecord::Base.connection.table_exists?('settings')
    return unless super
    [
      set('allow_auto_inventory_upload', N_('Allow automatic upload of the host inventory to the Red Hat cloud'), true),
      set('obfuscate_inventory_hostnames', N_('Obfuscate host names sent to Red Hat cloud'), false),
      set('rh_cloud_token', N_('Authentication token to Red Hat cloud services. Used to authenticate requests to cloud APIs'), 'DEFAULT', N_('Red Hat Cloud token'), nil, encrypted: true),
    ]
  end

  def self.humanized_category
    N_('RH Cloud')
  end
end
