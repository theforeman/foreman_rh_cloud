require 'test_plugin_helper'

module ForemanRhCloud
  class RegistrationManagerExtensionsTest < ActiveSupport::TestCase
    setup do
      @org = FactoryBot.create(:organization)
      @host = FactoryBot.create(:host, :managed, organization: @org)
      @insights_facet = ::InsightsFacet.create!(host: @host, uuid: 'test-uuid-123')

      # Stub Candlepin interaction (from Katello)
      ::Katello::Resources::Candlepin::Consumer.stubs(:destroy)

      # Stub the cloud request to avoid actual HTTP calls
      Katello::RegistrationManager.stubs(:execute_cloud_request).returns(true)
    end

    context 'unregister_host' do
      test 'should call HBI delete in IoP mode when host has insights facet with UUID' do
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
        expected_url = ForemanInventoryUpload.host_by_id_url('test-uuid-123')

        # Expect the cloud request to be made
        Katello::RegistrationManager.expects(:execute_cloud_request).with do |params|
          params[:organization] == @org &&
            params[:method] == :delete &&
            params[:url] == expected_url &&
            params[:headers][:content_type] == :json
        end.returns(true)

        Katello::RegistrationManager.unregister_host(@host, unregistering: true)

        # Verify insights_facet was destroyed
        assert_nil InsightsFacet.find_by(id: @insights_facet.id)
      end

      test 'should NOT call HBI delete in non-IoP mode' do
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

        # Should NOT attempt to delete from HBI
        Katello::RegistrationManager.expects(:execute_cloud_request).never

        Katello::RegistrationManager.unregister_host(@host, unregistering: true)

        # Verify insights_facet was still destroyed
        assert_nil InsightsFacet.find_by(id: @insights_facet.id)
      end

      test 'should NOT call HBI delete when host has no insights_facet' do
        host_without_facet = FactoryBot.create(:host, :managed, organization: @org)
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

        Katello::RegistrationManager.expects(:execute_cloud_request).never

        assert_nothing_raised do
          Katello::RegistrationManager.unregister_host(host_without_facet, unregistering: true)
        end
      end

      test 'should NOT call HBI delete when insights_facet has no UUID' do
        facet_id = @insights_facet.id
        @insights_facet.update(uuid: nil)
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

        Katello::RegistrationManager.expects(:execute_cloud_request).never

        Katello::RegistrationManager.unregister_host(@host, unregistering: true)

        # Verify facet was still destroyed
        assert_nil InsightsFacet.find_by(id: facet_id)
      end

      test 'should always destroy insights_facet regardless of IoP mode' do
        facet_id = @insights_facet.id
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

        assert_not_nil InsightsFacet.find_by(id: facet_id)

        Katello::RegistrationManager.unregister_host(@host, unregistering: true)

        assert_nil InsightsFacet.find_by(id: facet_id)
      end
    end

    context 'hbi_host_destroy error handling' do
      setup do
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
        @expected_url = ForemanInventoryUpload.host_by_id_url('test-uuid-123')
        @facet_id = @insights_facet.id
        # Unstub execute_cloud_request for error tests
        Katello::RegistrationManager.unstub(:execute_cloud_request)
      end

      test 'should handle RestClient::NotFound gracefully' do
        Katello::RegistrationManager.stubs(:execute_cloud_request).raises(RestClient::NotFound)

        # Should log warning but not raise
        Rails.logger.expects(:warn).with(regexp_matches(/host does not exist in HBI/))

        assert_nothing_raised do
          Katello::RegistrationManager.unregister_host(@host, unregistering: true)
        end

        # Facet should still be destroyed
        assert_nil InsightsFacet.find_by(id: @facet_id)
      end

      test 'should handle server errors gracefully' do
        error = RestClient::InternalServerError.new
        Katello::RegistrationManager.stubs(:execute_cloud_request).raises(error)

        # Should log error but not raise
        Rails.logger.expects(:error).with(regexp_matches(/Failed to destroy HBI host/))

        assert_nothing_raised do
          Katello::RegistrationManager.unregister_host(@host, unregistering: true)
        end

        # Facet should still be destroyed
        assert_nil InsightsFacet.find_by(id: @facet_id)
      end

      test 'should handle timeout errors gracefully' do
        error = RestClient::Exceptions::ReadTimeout.new
        Katello::RegistrationManager.stubs(:execute_cloud_request).raises(error)

        # Should log error but not raise
        Rails.logger.expects(:error).with(regexp_matches(/Failed to destroy HBI host/))

        assert_nothing_raised do
          Katello::RegistrationManager.unregister_host(@host, unregistering: true)
        end

        # Facet should still be destroyed
        assert_nil InsightsFacet.find_by(id: @facet_id)
      end

      test 'should handle connection errors gracefully' do
        error = Errno::ECONNREFUSED.new
        Katello::RegistrationManager.stubs(:execute_cloud_request).raises(error)

        # Should log error but not raise
        Rails.logger.expects(:error).with(regexp_matches(/Failed to destroy HBI host/))

        assert_nothing_raised do
          Katello::RegistrationManager.unregister_host(@host, unregistering: true)
        end

        # Facet should still be destroyed
        assert_nil InsightsFacet.find_by(id: @facet_id)
      end
    end

    context 'integration' do
      test 'should be properly prepended to RegistrationManager' do
        assert_includes Katello::RegistrationManager.singleton_class.ancestors,
                        ForemanRhCloud::RegistrationManagerExtensions
      end

      test 'should preserve original unregister_host behavior' do
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

        # Just verify the extension is properly integrated
        # Detailed Katello behavior is tested in Katello's own tests
        assert_nothing_raised do
          Katello::RegistrationManager.unregister_host(@host, unregistering: true)
        end
      end
    end

    context 'URL generation' do
      test 'host_by_id_url should return correct format' do
        url = ForemanInventoryUpload.host_by_id_url('test-uuid-123')

        assert_match %r{/hosts/test-uuid-123$}, url
      end
    end
  end
end
