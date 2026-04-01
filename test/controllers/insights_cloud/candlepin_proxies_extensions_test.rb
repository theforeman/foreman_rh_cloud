require 'test_plugin_helper'

module InsightsCloud
  class CandlepinProxiesExtensionsTest < ActiveSupport::TestCase
    setup do
      @organization = FactoryBot.create(:organization)
      @host = FactoryBot.create(:host, :with_subscription, :managed, organization: @organization)
    end

    test 'updates InsightsClientReportStatus to USER_OMITTED when parameter is false' do
      # Set parameter to false so status should be USER_OMITTED
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: false)

      # Simulate what the callback does
      @host.get_status(InsightsClientReportStatus).refresh!
      @host.refresh_global_status!

      # Verify the status was updated
      @host.reload
      insights_status = @host.get_status(InsightsClientReportStatus)
      assert insights_status.persisted?, 'InsightsClientReportStatus should be persisted'
      assert_equal InsightsClientReportStatus::USER_OMITTED, insights_status.status,
        'Status should be USER_OMITTED when host_registration_insights=false'
    end

    test 'sets USER_OMITTED status when parameter is inherited from hostgroup' do
      # Create hostgroup with parameter
      hostgroup = FactoryBot.create(:hostgroup)
      hostgroup.group_parameters << GroupParameter.create(
        name: 'host_registration_insights',
        value: 'false',
        key_type: 'boolean'
      )
      hostgroup.save!

      @host.hostgroup = hostgroup
      @host.save!

      # Simulate what the callback does
      @host.get_status(InsightsClientReportStatus).refresh!
      @host.refresh_global_status!

      # Verify status respects inherited parameter
      @host.reload
      insights_status = @host.get_status(InsightsClientReportStatus)
      assert_equal InsightsClientReportStatus::USER_OMITTED, insights_status.status,
        'Status should be USER_OMITTED when host_registration_insights=false is inherited from hostgroup'
    end

    test 'refreshes global status' do
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: true)

      # Simulate what the callback does
      @host.get_status(InsightsClientReportStatus).refresh!
      @host.refresh_global_status!

      # Verify global status was updated
      @host.reload
      assert_not_nil @host.global_status, 'Global status should be set'
    end

    test 'CandlepinProxiesController includes the update_insights_client_status method' do
      # Verify the concern is included and method is available
      controller = Katello::Api::Rhsm::CandlepinProxiesController.new

      assert_respond_to controller, :update_insights_client_status,
        'CandlepinProxiesController should have update_insights_client_status method from concern'
    end
  end
end
