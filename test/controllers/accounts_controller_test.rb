require 'test_plugin_helper'

class AccountsControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::AccountsController

  include FolderIsolation

  test 'Returns statuses for each process type' do
    test_org = FactoryBot.create(:organization)

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert actual['accounts'].key?(test_org.name)
    actual_account = actual['accounts'][test_org.name]

    # Verify the response structure
    assert_includes actual_account.keys, 'generated_status'
    assert_includes actual_account.keys, 'uploaded_status'
    assert_includes actual_account.keys, 'generate_task'
    assert_includes actual_account.keys, 'report_file_paths'
    assert_equal test_org.id, actual_account['id']
  end
end
