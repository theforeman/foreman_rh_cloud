require 'test_plugin_helper'

class InsightsClientReportStatusTest < ActiveSupport::TestCase
  describe 'to_status' do
    let(:host) { FactoryBot.create(:host, :managed) }

    setup do
      CommonParameter.where(name: 'host_registration_insights').destroy_all
    end

    test 'host_registration_insights = true & is getting data' do
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: true, host: host)
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)

      assert_equal 0, host_status.to_status(data: true)
    end

    test 'host_registration_insights = true & no data in less than 48 hours' do
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: true, host: host)
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      host_status.update(reported_at: 1.day.ago)
      assert_equal 0, host_status.to_status
    end

    test 'host_registration_insights = true & no data in more than 48 hours' do
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: true, host: host)
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      host_status.update(reported_at: 3.days.ago)
      assert_equal 1, host_status.to_status
    end

    test 'host_registration_insights = false & no data' do
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: false, host: host)
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      assert_equal 2, host_status.to_status
    end

    test 'host_registration_insights = false & getting data' do
      FactoryBot.create(:common_parameter, name: 'host_registration_insights', key_type: 'boolean', value: false, host: host)
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      assert_equal 3, host_status.to_status(data: true)
    end

    test 'host_registration_insights = nil & is getting data' do
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      assert_equal 3, host_status.to_status(data: true)
    end

    test 'host_registration_insights = nil & no data in less than 48 hours' do
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      host_status.update(reported_at: 1.day.ago)
      assert_equal 2, host_status.to_status
    end

    test 'host_registration_insights = nil & no data in more than 48 hours' do
      host_status = Host.find_by_name(host.name).reload.get_status(InsightsClientReportStatus)
      host_status.update(reported_at: 3.days.ago)
      assert_equal 2, host_status.to_status
    end
  end
end
