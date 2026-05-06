module ForemanInventoryUpload
  def self.base_folder
    # in production setup, where selinux is enabled, we only have rights to
    # create folders under /var/lib/foreman. If the folder does not exist, it's
    # a dev setup, where we can use the parent of the current working directory
    @base_folder ||= File.join(
      Dir.glob('/var/lib/foreman').first || File.dirname(Dir.getwd),
      'red_hat_inventory/'
    )
  end

  def self.uploads_folder
    @uploads_folder ||= ensure_folder(
      File.join(
        ForemanInventoryUpload.base_folder,
        'uploads/'
      )
    )
  end

  def self.uploads_file_path(filename)
    File.join(ForemanInventoryUpload.uploads_folder, filename)
  end

  def self.done_folder
    File.join(ForemanInventoryUpload.uploads_folder, 'done/')
  end

  def self.done_file_path(filename)
    File.join(ForemanInventoryUpload.done_folder, filename)
  end

  def self.generated_reports_folder
    @generated_reports_folder ||= ensure_folder(
      File.join(
        ForemanInventoryUpload.base_folder,
        'generated_reports/'
      )
    )
  end

  def self.generated_reports_file_path(filename)
    File.join(ForemanInventoryUpload.generated_reports_folder, filename)
  end

  def self.report_file_paths(organization_id)
    filename = facts_archive_name(organization_id)
    # Report files start in generated
    # They are then MOVED (not copied) to uploads, then done.
    # When they are moved to the new folder, they overwrite any file with the same name.
    # If it's a generate-only, it will be in generated
    # Failed or incomplete uploads will be in uploads
    # Completed uploads will be in done
    # The ordering here ensures we get the correct file path every time.
    Dir[
      ForemanInventoryUpload.generated_reports_file_path(filename),
      ForemanInventoryUpload.uploads_file_path(filename),
      ForemanInventoryUpload.done_file_path(filename),
    ]
  end

  def self.outputs_folder
    @outputs_folder ||= ensure_folder(File.join(ForemanInventoryUpload.base_folder, 'outputs/'))
  end

  def self.facts_archive_name(organization, filter = nil)
    "report_for_#{organization}#{filter.empty? ? nil : "[#{filter.to_s.parameterize}]"}.tar.xz"
  end

  def self.upload_url
    # for testing set ENV to 'https://ci.cloud.redhat.com/api/ingress/v1/upload'
    ENV['SATELLITE_INVENTORY_UPLOAD_URL'] || "#{ForemanRhCloud.cert_base_url}/api/ingress/v1/upload"
  end

  def self.slice_size
    @slice_size ||= (ENV['SATELLITE_INVENTORY_SLICE_SIZE'] || '1000').to_i
  end

  def self.max_org_size
    # Set max amount of hosts per organization for automatic uploads
    @max_org_size ||= (ENV['SATELLITE_INVENTORY_MAX_ORG_SIZE'] || 150_000).to_i
  end

  def self.ensure_folder(folder)
    FileUtils.mkdir_p(folder)
    folder
  end

  def self.inventory_base_url
    "#{ForemanRhCloud.cert_base_url}/api/inventory/v1/hosts"
  end

  def self.inventory_export_url
    tags = CGI.escape("satellite/satellite_instance_id=#{Foreman.instance_id}")
    inventory_base_url + "?tags=#{tags}"
  end

  def self.inventory_self_url
    host = ForemanRhCloud.foreman_host
    hostname = host ? host.fqdn : ForemanRhCloud.foreman_host_name
    if hostname.nil?
      Rails.logger.warn("Cannot determine Foreman hostname for inventory sync. " \
                        "Please configure Setting[:foreman_url]. " \
                        "Containerized setups must explicitly set this.")
    end
    inventory_base_url + "?hostname_or_id=#{hostname}"
  end

  def self.host_by_id_url(host_uuid)
    "#{inventory_base_url}/#{host_uuid}"
  end

  def self.hosts_delete_all_url
    "#{inventory_base_url}/all?confirm_delete_all=true"
  end

  def self.hosts_by_ids_url(host_uuids)
    host_ids_string = host_uuids.join(',')
    "#{inventory_base_url}/#{host_ids_string}"
  end
end
