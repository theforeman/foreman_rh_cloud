require 'foreman_yupana/engine'

module ForemanYupana
  def self.base_folder
    'red_hat_inventory/'
  end

  def self.uploads_folder
    @uploads_folder ||= ensure_folder(File.join(ForemanYupana.base_folder, 'uploads/'))
  end

  def self.outputs_folder
    @outputs_folder ||= ensure_folder(File.join(ForemanYupana.base_folder, 'outputs/'))
  end

  def self.upload_script_file
    File.join(uploads_folder, 'uploader.sh')
  end

  def self.upload_url
    'https://cloud.redhat.com/'
  end

  def self.uploader_output
    'uploader_output'
  end

  def self.ensure_folder(folder)
    FileUtils.mkdir_p(folder)
    folder
  end
end
