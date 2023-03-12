# This calls the main test_helper in Foreman-core
require 'test_helper'

# Add plugin to FactoryBot's paths
FactoryBot.definition_file_paths << "#{ForemanTasks::Engine.root}/test/factories"
FactoryBot.definition_file_paths << "#{ForemanRemoteExecution::Engine.root}/test/factories"
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
      Setting[:default_location_subscribed_hosts] = Location.first.title
    end
  end
end

module MockCerts
  extend ActiveSupport::Concern

  def test_certificate
    @test_certificate ||= "-----BEGIN CERTIFICATE-----\r\n" +
      "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\r\n" +
      "osxMtcaZZ1E=\r\n" +
      "-----END CERTIFICATE-----"
  end

  def generate_certs_hash
    {
      cert: test_certificate,
      key: OpenSSL::PKey::RSA.new(1024).to_pem,
    }
  end

  def setup_certs_expectation
    expectation = yield
    expectation.returns(
      generate_certs_hash
    )
  end
end

module MockForemanHostname
  extend ActiveSupport::Concern

  included do
    setup do
      @foreman_host = FactoryBot.create(:host, :managed)
      ForemanRhCloud.stubs(:foreman_host_name).returns(@foreman_host.name)
    end
  end
end
