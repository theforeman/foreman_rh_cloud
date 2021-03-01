# This calls the main test_helper in Foreman-core
require 'test_helper'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
# FactoryBot.definition_file_paths << "#{Katello::Engine.root}/test/factories"
FactoryBot.reload

module FolderIsolation
  extend ActiveSupport::Concern

  included do
    setup do
      @tmpdir = Dir.mktmpdir(self.class.name.underscore)

      ForemanInventoryUpload.stubs(:base_folder).returns(@tmpdir)
      ForemanInventoryUpload.instance_variable_set(:@outputs_folder, nil)
      ForemanInventoryUpload.instance_variable_set(:@uploads_folders, nil)
    end

    teardown do
      FileUtils.remove_entry @tmpdir
      ForemanInventoryUpload.unstub(:base_folder)
    end
  end
end

module KatelloLocationFix
  extend ActiveSupport::Concern

  included do
    setup do
      FactoryBot.create(:setting, name: 'default_location_subscribed_hosts')
      FactoryBot.create(:setting, name: 'default_location_puppet_content')
      Setting[:default_location_subscribed_hosts] = Location.first.title
      Setting[:default_location_puppet_content] = Location.first.title
    end
  end
end
