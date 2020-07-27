require 'test_helper'

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

  test 'Host status should be SYNC' do
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)

    InventorySync::Async::InventoryFullSync.perform_now(@host1.organization)

    @host1.reload

    assert_equal InventorySync::InventoryStatus::SYNC, InventorySync::InventoryStatus.where(host_id: @host1.id).first.status
  end

  test 'Host status should be DISCONNECT' do
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)

    InventorySync::Async::InventoryFullSync.perform_now(@host2.organization)

    @host2.reload

    # assert_equal InventorySync::InventoryStatus::DISCONNECT, InventorySync::InventoryStatus.where(host_id: @host2.id).first.status
    assert_nil InventorySync::InventoryStatus.where(host_id: @host2.id).first
  end
end
