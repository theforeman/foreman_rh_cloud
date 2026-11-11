module ForemanInventoryUpload
  def self.base_folder
    @base_folder ||= Rails.root.join('tmp/red_hat_inventory').to_s
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

  # Podman volume that holds inventory reports in foremanctl deployments.
  FOREMAN_DATA_RUN_VOLUME = 'foreman-data-run'.freeze

  # Absolute path of a report file (container or local filesystem).
  def self.absolute_report_path(path)
    return path if path.blank?

    File.realpath(path)
  rescue Errno::ENOENT
    File.expand_path(path.to_s)
  end

  # Container path of the foreman-data-run volume root (parent of base_folder).
  def self.inventory_volume_root
    container_base = begin
      File.realpath(base_folder)
    rescue Errno::ENOENT
      File.expand_path(base_folder)
    end
    File.dirname(container_base)
  end

  # Path of the report relative to the foreman-data-run volume root
  # (e.g. "red_hat_inventory/uploads/done/report_for_1.tar.xz").
  # Returns nil when the report is outside the volume.
  def self.inventory_volume_relative_path(path)
    absolute = absolute_report_path(path)
    return nil if absolute.blank?

    volume_root = inventory_volume_root
    return nil unless absolute == volume_root || absolute.start_with?("#{volume_root}/")

    relative = absolute.delete_prefix(volume_root).delete_prefix('/')
    relative.presence || '.'
  end

  # True when logs should use the local filesystem path (dev/test).
  # Production/foremanctl logs the volume name + relative path instead,
  # since mountinfo typically exposes the volume device rather than a host directory.
  # foremanctl can later inject FOREMAN_DATA_RUN_MOUNTPOINT for a complete host path.
  def self.filesystem_report_path_logging?
    Rails.env.development? || Rails.env.test?
  end

  # Human-readable location for inventory report logs.
  def self.inventory_report_location(path)
    return path if path.blank?

    absolute = absolute_report_path(path)
    return absolute if filesystem_report_path_logging?

    relative = inventory_volume_relative_path(path)
    mountpoint = ENV['FOREMAN_DATA_RUN_MOUNTPOINT'].presence

    if relative.nil?
      "#{absolute} (outside podman volume '#{FOREMAN_DATA_RUN_VOLUME}')"
    elsif mountpoint
      File.join(mountpoint, relative)
    else
      "podman volume '#{FOREMAN_DATA_RUN_VOLUME}' at relative path '#{relative}' " \
        "(on the host, run: sudo podman volume inspect --format '{{.Mountpoint}}' #{FOREMAN_DATA_RUN_VOLUME} " \
        "and append that relative path)"
    end
  end

  def self.log_inventory_report_saved(logger, path)
    logger.info("Inventory report saved to #{inventory_report_location(path)}")
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
