require 'test_plugin_helper'

class UploadReportJobTest < ActiveJob::TestCase
  include FolderIsolation

  test 'returns aborted state when disconnected' do
    FactoryBot.create(:setting, :name => 'content_disconnected', :value => true)

    ForemanInventoryUpload::Async::UploadReportJob.perform_now('', 100)

    label = ForemanInventoryUpload::Async::UploadReportJob.output_label(100)
    progress_output = ForemanInventoryUpload::Async::ProgressOutput.get(label)
    assert_match(/Upload was stopped/, progress_output.full_output)
    assert_match(/exit 1/, progress_output.status)
  end
end
