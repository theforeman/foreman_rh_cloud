require 'foreman_yupana/engine'

module ForemanYupana
  def self.base_folder
    'red_hat_inventory/'
  end

  def self.uploads_folder(group)
    @uploads_folder ||= ensure_folder(File.join(ForemanYupana.base_folder, 'uploads/', "#{group}/"))
  end

  def self.outputs_folder
    @outputs_folder ||= ensure_folder(File.join(ForemanYupana.base_folder, 'outputs/'))
  end

  def self.upload_script_file
    'uploader.sh'
  end

  def self.upload_url
    'https://cloud.redhat.com/'
  end

  def self.ensure_folder(folder)
    FileUtils.mkdir_p(folder)
    folder
  end
end
