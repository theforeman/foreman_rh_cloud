# This calls the main test_helper in Foreman-core
require 'test_helper'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << File.join(File.dirname(__FILE__), 'factories')
# FactoryBot.definition_file_paths << "#{Katello::Engine.root}/test/factories"
FactoryBot.reload
