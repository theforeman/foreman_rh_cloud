Foreman::SettingManager.define(:foreman) do
  category(:rh_cloud, N_('RHCloud')) do
    setting('allow_auto_inventory_upload', type: :boolean, description: N_('Enable automatic upload of your host inventory to the Red Hat cloud'), default: true, full_name: N_('Automatic inventory upload'))
    setting('allow_auto_insights_sync', type: :boolean, description: N_('Enable automatic synchronization of Insights recommendations from the Red Hat cloud'), default: false, full_name: N_('Synchronize recommendations Automatically'))
    setting('allow_auto_insights_mismatch_delete', type: :boolean, description: N_('Enable automatic deletion of mismatched host records from the cloud'), default: false, full_name: N_('Automatic mismatch deletion'))
    setting('obfuscate_inventory_hostnames', type: :boolean, description: N_('Obfuscate host names sent to the Red Hat cloud'), default: false, full_name: N_('Obfuscate host names'))
    setting('obfuscate_inventory_ips', type: :boolean, description: N_('Obfuscate ipv4 addresses sent to the Red Hat cloud'), default: false, full_name: N_('Obfuscate host ipv4 addresses'))
    setting('exclude_installed_packages', type: :boolean, description: N_('Exclude installed packages from being uploaded to the Red Hat cloud'), default: false, full_name: N_("Exclude installed Packages"))
    setting('include_parameter_tags', type: :boolean, description: N_('Should import include parameter tags from Foreman?'), default: false, full_name: N_('Include parameters in insights-client reports'))
    setting('rhc_instance_id', type: :string, description: N_('RHC daemon id'), default: nil, full_name: N_('ID of the RHC(Yggdrasil) daemon'))
  end
end
