require 'foreman_inventory_upload/engine'

module ForemanInventoryUpload
  def self.base_folder
    # in production setup, where selinux is enabled, we only have rights to
    # create folders under /ver/lib/foreman. If the folder does not exist, it's
    # a dev setup, where we can use our current root
    @base_folder ||= File.join(
      Dir.glob('/var/lib/foreman').first || Dir.getwd,
      'red_hat_inventory/'
    )
  end

  def self.uploads_folder(group)
    @uploads_folders ||= {}
    cache = @uploads_folders[group]
    return cache if cache

    @uploads_folders[group] = ensure_folder(
      File.join(
        ForemanInventoryUpload.base_folder,
        'uploads/',
        "#{group}/"
      )
    )
  end

  def self.outputs_folder
    @outputs_folder ||= ensure_folder(File.join(ForemanInventoryUpload.base_folder, 'outputs/'))
  end

  def self.upload_script_file
    'uploader.sh'
  end

  def self.facts_archive_name
    'hosts_report.tar.gz'
  end

  def self.upload_url
    'https://ci.cloud.paas.psi.redhat.com/api/ingress/v1/upload'
  end

  def self.ensure_folder(folder)
    FileUtils.mkdir_p(folder)
    folder
  end
end
