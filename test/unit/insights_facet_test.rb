require 'test_plugin_helper'

class InsightsFacetTest < ActiveSupport::TestCase
  setup do
    @host = FactoryBot.create(:host, :with_insights_hits)
  end

  test 'host with hits can be deleted' do
    assert_equal 1, @host.insights.hits.count

    host_id = @host.id
    @host.destroy
    actual_host = Host.find_by_id(host_id)
    assert_nil actual_host
  end
end
