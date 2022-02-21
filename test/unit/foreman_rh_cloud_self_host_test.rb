require 'test_plugin_helper'

class ForemanRhCloudSelfHostTest < ActiveSupport::TestCase
  setup do
    # reset cached value
    ForemanRhCloud.instance_variable_set(:@foreman_host, nil)
  end

  test 'finds host by fullname' do
    @domain
    @host = FactoryBot.create(:host, :managed)
    ForemanRhCloud.expects(:foreman_host_name).returns(@host.name)

    actual = ForemanRhCloud.foreman_host

    assert_not_nil actual
  end

  test 'finds host by shortname' do
    @host = FactoryBot.create(:host, :managed)
    Host.where(name: @host.name).update_all(name: @host.shortname)
    ForemanRhCloud.expects(:foreman_host_name).returns(@host.name)

    actual = ForemanRhCloud.foreman_host

    assert_not_nil actual
  end

  test 'finds host by infrastructure facet' do
    @host = FactoryBot.create(:host, :managed, :with_infrastructure_facet)
    actual = ForemanRhCloud.foreman_host

    assert_equal @host, actual
  end
end
