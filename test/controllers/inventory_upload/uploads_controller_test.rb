require 'test_plugin_helper'

class InventoryUploadsControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::UploadsController

  setup do
    @organization = FactoryBot.create(:organization)
    @report = ForemanInventoryUpload::Report.create!(
      organization: @organization,
      filename: ForemanInventoryUpload.facts_archive_name(@organization.id),
      sha256: Digest::SHA256.hexdigest('inventory archive')
    )
    @report.archive.attach(io: StringIO.new('inventory archive'), filename: @report.filename)
  end

  test 'streams a report from an accessible organization through the UI' do
    get :download_file, params: { organization_id: @organization.id }, session: set_session_user

    assert_response :success
    assert_equal 'inventory archive', response.body
  end

  test 'rejects an inaccessible organization before looking up its report through the UI' do
    User.any_instance.stubs(:my_organizations).returns(Organization.where(id: -1))
    ForemanInventoryUpload::Report.expects(:where).never

    get :download_file, params: { organization_id: @organization.id }, session: set_session_user

    assert_response :not_found
  end
end
