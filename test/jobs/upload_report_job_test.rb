require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class UploadReportJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  test 'returns aborted state when disconnected' do
    organization = FactoryBot.create(:organization)
    Organization.any_instance.stubs(:owner_details).returns(
      'upstreamConsumer' => {
        'idCert' => 'TEST_CERT',
      }
    )
    ForemanInventoryUpload::Async::UploadReportJob.any_instance.expects(:content_disconnected?).returns(true)

    action = create_and_plan_action(ForemanInventoryUpload::Async::UploadReportJob, '', organization.id)
    run_action(action)

    label = ForemanInventoryUpload::Async::UploadReportJob.output_label(organization.id)
    progress_output = ForemanInventoryUpload::Async::ProgressOutput.get(label)
    assert_match(/upload was canceled because connection to Insights is not enabled/, progress_output.full_output)
    assert_match(/Report location:/, progress_output.full_output)
    assert_match(/exit 1/, progress_output.status)
  end

  test 'returns aborted state when no certificate defined on organization' do
    organization = FactoryBot.create(:organization)
    Organization.any_instance.expects(:owner_details).returns(nil)

    action = create_and_plan_action(ForemanInventoryUpload::Async::UploadReportJob, '', organization.id)
    run_action(action)

    label = ForemanInventoryUpload::Async::UploadReportJob.output_label(organization.id)
    progress_output = ForemanInventoryUpload::Async::ProgressOutput.get(label)
    assert_match(/Skipping organization/, progress_output.full_output)
    assert_match(/exit 1/, progress_output.status)
  end
end
