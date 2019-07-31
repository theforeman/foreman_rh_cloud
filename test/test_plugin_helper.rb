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

      ForemanYupana.stubs(:base_folder).returns(@tmpdir)
      ForemanYupana.instance_variable_set(:@outputs_folder, nil)
      ForemanYupana.instance_variable_set(:@uploads_folders, nil)
    end

    teardown do
      FileUtils.remove_entry @tmpdir
      ForemanYupana.unstub(:base_folder)
    end
  end
end
