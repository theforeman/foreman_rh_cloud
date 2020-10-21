require 'test_plugin_helper'

class ForemanRhCloudTest < ActiveSupport::TestCase
  test 'should prepare correct cloud url' do
    paths = {
      "/redhat_access/r/insights/platform/module-update-router/v1/channel?module=insights-core" => "https://cloud.redhat.com/api/module-update-router/v1/channel?module=insights-core",
      "/redhat_access/r/insights/v1/static/release/insights-core.egg" => "https://cloud.redhat.com/api/v1/static/release/insights-core.egg",
      "/redhat_access/r/insights/v1/static/uploader.v2.json" => "https://cloud.redhat.com/api/v1/static/uploader.v2.json",
      "/redhat_access/r/insights/v1/static/uploader.v2.json.asc" => "https://cloud.redhat.com/api/v1/static/uploader.v2.json.asc",
      "/redhat_access/r/insights/platform/inventory/v1/hosts" => "https://cloud.redhat.com/api/inventory/v1/hosts",
      "/redhat_access/r/insights/platform/ingress/v1/upload" => "https://cloud.redhat.com/api/ingress/v1/upload",
    }

    paths.each do |key, value|
      assert_equal value, ForemanRhCloud.prepare_forward_cloud_url(ForemanRhCloud.base_url, key)
    end
  end
end
