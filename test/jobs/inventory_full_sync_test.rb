require 'test_plugin_helper'

class InventoryFullSyncTest < ActiveJob::TestCase
  setup do
    @host1 = FactoryBot.create(:host, :managed, name: 'host1')

    User.current = User.find_by(login: 'secret_admin')

    env = FactoryBot.create(:katello_k_t_environment)
    cv = env.content_views << FactoryBot.create(:katello_content_view, organization: env.organization)

    # this host would pass our plugin queries, so it could be uploaded to the cloud.
    @host2 = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: cv.first,
      lifecycle_environment: env,
      organization: env.organization
    )

    @host2.subscription_facet.pools << FactoryBot.create(:katello_pool, account_number: '1234', cp_id: 1)

    ForemanInventoryUpload::Generators::Queries.instance_variable_set(:@fact_names, nil)

    inventory_json = <<-INVENTORY_JSON
    {
      "total": 3,
      "count": 3,
      "page": 1,
      "per_page": 50,
      "results": [{"fqdn": "#{@host1.fqdn}"}]
    }
    INVENTORY_JSON
    @inventory = JSON.parse(inventory_json)
  end

  def interesting_facts
    [
      'dmi::system::uuid',
      'virt::uuid',
      'cpu::cpu(s)',
      'cpu::cpu_socket(s)',
      'cpu::core(s)_per_socket',
      'memory::memtotal',
      'dmi::bios::vendor',
      'dmi::bios::version',
      'dmi::bios::relase_date',
      'uname::release',
      'lscpu::flags',
      'distribution::name',
      'distribution::version',
      'distribution::id',
      'virt::is_guest',
      'dmi::system::manufacturer',
      'dmi::system::product_name',
      'dmi::chassis::asset_tag',
      'insights_client::obfuscate_hostname_enabled',
      'insights_client::hostname',
    ]
  end

  def fact_names
    @fact_names ||= Hash[
      interesting_facts.map do |fact|
        [fact, FactoryBot.create(:fact_name, name: fact, type: 'Katello::RhsmFactName')]
      end
    ]
  end

  test 'Host status should be SYNC for inventory hosts' do
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)

    ForemanTasks.sync_task(InventorySync::Async::InventoryFullSync, @host1.organization)

    @host1.reload

    assert_equal InventorySync::InventoryStatus::SYNC, InventorySync::InventoryStatus.where(host_id: @host1.id).first.status
  end

  test 'Host status should be DISCONNECT for hosts that are not returned from cloud' do
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    ForemanTasks.sync_task(InventorySync::Async::InventoryFullSync, @host2.organization)
    @host2.reload

    assert_equal InventorySync::InventoryStatus::DISCONNECT, InventorySync::InventoryStatus.where(host_id: @host2.id).first.status
  end
end
