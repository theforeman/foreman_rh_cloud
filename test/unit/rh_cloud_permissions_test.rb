require 'test_plugin_helper'
require 'unit/shared/access_permissions_test_base'

class RhCloudPermissionsTest < ActiveSupport::TestCase
  include AccessPermissionsTestBase

  check_routes(
    Rails.application.routes,
    [
      'insights_cloud/api/machine_telemetries/forward_request',
      'insights_cloud/api/machine_telemetries/branch_info',
      'api/v2/rh_cloud/foreman_inventory_upload/api/tasks/current',
      'api/v2/rh_cloud/foreman_inventory_upload/api/tasks/history',
    ],
    skip_patterns: [/^(?!foreman_inventory_upload|insights_cloud|.*rh_cloud).*/]
  ) # include only plugin paths
end
