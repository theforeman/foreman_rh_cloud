require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class InventoryFullSyncTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
  include MockCerts
  include KatelloCVEHelper
  include CandlepinIsolation

  setup do
    User.current = User.find_by(login: 'secret_admin')

    InventorySync::Async::InventoryFullSync.any_instance.stubs(:plan_self_host_sync)
    Organization.any_instance.stubs(:manifest_expired?).returns(false)

    cve = make_cve
    env = cve.lifecycle_environment

    # this host would pass our plugin queries, so it could be uploaded to the cloud.
    @host1 = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: cve.content_view,
      lifecycle_environment: env,
      organization: env.organization
    )

    pool = FactoryBot.create(:katello_pool, account_number: '1234', cp_id: 1)

    @host1.subscription_facet.pools << pool

    # this host would pass our plugin queries, so it could be uploaded to the cloud.
    @host2 = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: cve.content_view,
      lifecycle_environment: env,
      organization: env.organization
    )

    @host2.subscription_facet.pools << pool
    @host2_inventory_id = '4536bf5c-ff03-4154-a8c9-32ff4b40e40c'

    # this host would pass our plugin queries, so it could be uploaded to the cloud.
    @host3 = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: cve.content_view,
      lifecycle_environment: env,
      organization: env.organization
    )

    @host3.subscription_facet.pools << pool

    ForemanInventoryUpload::Generators::Queries.instance_variable_set(:@fact_names, nil)

    inventory_json = <<-INVENTORY_JSON
    {
      "total": 3,
      "count": 3,
      "page": 1,
      "per_page": 3,
      "results": [
        {
          "insights_id": "72d29d75-dbbf-4121-9566-2f581ab77f36",
          "rhel_machine_id": null,
          "subscription_manager_id": "#{@host2.subscription_facet.uuid}",
          "satellite_id": "bb72bf95-0a19-4090-8009-f0d8c68aca61",
          "bios_uuid": "b48a7e5f-cb50-4029-a75e-366bf43db641",
          "ip_addresses": [
            "192.168.122.56"
          ],
          "fqdn": "#{@host2.fqdn}",
          "mac_addresses": [
            "52:54:00:aa:12:12",
            "00:00:00:00:00:00"
          ],
          "external_id": null,
          "id": "#{@host2_inventory_id}",
          "account": "1460290",
          "display_name": "insights-rh7.example.com",
          "ansible_host": null,
          "facts": [
            {
              "namespace": "satellite",
              "facts": {
                "virtual_host_name": "virt-who-nobody.home-1",
                "satellite_instance_id": "fc4d0cb0-a0b0-421e-b096-b028319b8e47",
                "is_simple_content_access": false,
                "distribution_version": "7.3",
                "satellite_version": "6.8.4",
                "organization_id": 1,
                "is_hostname_obfuscated": false,
                "virtual_host_uuid": "a90e6294-4766-420a-8dc0-3ec5b96d60ec"
              }
            },
            {
              "namespace": "yupana",
              "facts": {
                "report_platform_id": "d37afa50-08ce-4efb-a0e5-759c2a016661",
                "report_slice_id": "5bf791d7-5e30-4a3c-929a-11dd9fa6eb72",
                "source": "Satellite",
                "yupana_host_id": "e85958b6-58db-4cfd-aeb6-01ee81bc0f43",
                "account": "1460290"
              }
            }
          ],
          "reporter": "puptoo",
          "stale_timestamp": "2021-03-19T07:57:42.466399+00:00",
          "stale_warning_timestamp": "2021-03-26T07:57:42.466399+00:00",
          "culled_timestamp": "2021-04-02T07:57:42.466399+00:00",
          "created": "2021-02-08T14:36:03.613880+00:00",
          "updated": "2021-03-18T02:57:42.535250+00:00"
        },
        {
          "insights_id": "e0dc5144-d78e-43ed-97be-a7a21d1b6946",
          "rhel_machine_id": null,
          "subscription_manager_id": "0f97ee19-6862-4900-aea4-f121c8754776",
          "satellite_id": "0f97ee19-6862-4900-aea4-f121c8754776",
          "bios_uuid": "6a0b199a-8225-4ade-ae44-3b18cfc84a01",
          "ip_addresses": [
            "192.168.122.136"
          ],
          "fqdn": "#{@host1.fqdn}",
          "mac_addresses": [
            "52:54:00:02:d1:2a",
            "00:00:00:00:00:00"
          ],
          "external_id": null,
          "id": "3255d080-e6c1-44e2-8d72-b044b9a38d8f",
          "account": "1460290",
          "display_name": "insights-rh8.example.com",
          "ansible_host": null,
          "facts": [
            {
              "namespace": "satellite",
              "facts": {
                "virtual_host_name": "virt-who-nobody.home-1",
                "satellite_instance_id": "fc4d0cb0-a0b0-421e-b096-b028319b8e47",
                "is_simple_content_access": false,
                "distribution_version": "8.3",
                "satellite_version": "6.8.4",
                "organization_id": 1,
                "is_hostname_obfuscated": false,
                "virtual_host_uuid": "a90e6294-4766-420a-8dc0-3ec5b96d60ec"
              }
            },
            {
              "namespace": "yupana",
              "facts": {
                "report_platform_id": "d37afa50-08ce-4efb-a0e5-759c2a016661",
                "report_slice_id": "5bf791d7-5e30-4a3c-929a-11dd9fa6eb72",
                "source": "Satellite",
                "yupana_host_id": "78c62486-0ac4-406c-a4c0-3a1f81112a2d",
                "account": "1460290"
              }
            }
          ],
          "reporter": "puptoo",
          "stale_timestamp": "2021-03-19T06:05:12.092136+00:00",
          "stale_warning_timestamp": "2021-03-26T06:05:12.092136+00:00",
          "culled_timestamp": "2021-04-02T06:05:12.092136+00:00",
          "created": "2021-02-08T13:22:50.555671+00:00",
          "updated": "2021-03-18T01:05:12.131847+00:00"
        },
        {
          "insights_id": "b533848e-465f-4f1a-9b2b-b71cb2d5239d",
          "rhel_machine_id": null,
          "subscription_manager_id": "#{@host3.subscription_facet.uuid}",
          "satellite_id": "d29bde40-348e-437c-8acf-8fa98320fc1b",
          "bios_uuid": "3cd5d972-cfb5-451a-8314-fd2f56629d7c",
          "ip_addresses": [
            "172.16.5.39",
            "fd6e:2298:736e::857",
            "fd6e:2298:736e:0:2c66:6101:9cc6:2b23"
          ],
          "fqdn": "#{@host3.fqdn}",
          "mac_addresses": [
            "6e:66:a6:fe:fc:07",
            "00:00:00:00:00:00"
          ],
          "external_id": null,
          "id": "59ab38db-c25b-4fc7-bfb2-c8eb01d865a9",
          "account": "1460290",
          "display_name": "rhel8-demo.oss-lab.net",
          "ansible_host": null,
          "facts": [
            {
              "namespace": "satellite",
              "facts": {
                "satellite_instance_id": "fb3643d8-9030-487b-b95c-684783806ffd",
                "system_purpose_sla": "",
                "is_simple_content_access": false,
                "distribution_version": "8.3",
                "satellite_version": "6.8.1",
                "organization_id": 1,
                "system_purpose_role": "",
                "system_purpose_usage": "",
                "is_hostname_obfuscated": false
              }
            },
            {
              "namespace": "yupana",
              "facts": {
                "report_platform_id": "fa8b924c-51ee-479d-97d2-b4623cf1d4aa",
                "report_slice_id": "0b49103f-6471-4ade-ad74-a51537bc5691",
                "source": "Satellite",
                "yupana_host_id": "30e43340-12fb-445d-b23f-faaf5cbc2092",
                "account": "1460290"
              }
            }
          ],
          "reporter": "puptoo",
          "stale_timestamp": "2021-03-19T05:55:23.700781+00:00",
          "stale_warning_timestamp": "2021-03-26T05:55:23.700781+00:00",
          "culled_timestamp": "2021-04-02T05:55:23.700781+00:00",
          "created": "2021-01-13T20:05:51.059012+00:00",
          "updated": "2021-03-18T00:55:23.739162+00:00"
        }
      ]
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
    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end

    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host2.organization)
    run_action(action)

    @host2.reload

    assert_equal InventorySync::InventoryStatus::SYNC, InventorySync::InventoryStatus.where(host_id: @host2.id).first.status
    assert_equal @host2_inventory_id, @host2.insights.uuid
  end

  test 'Host status should be DISCONNECT for hosts that are not returned from cloud' do
    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)
    @host2.reload

    assert_equal InventorySync::InventoryStatus::DISCONNECT, InventorySync::InventoryStatus.where(host_id: @host1.id).first.status
  end

  test 'Task should be aborted if manifest is not present' do
    InventorySync::Async::InventoryFullSync.any_instance.expects(:upstream_owner).returns(nil)

    InventorySync::Async::InventoryFullSync.any_instance.expects(:plan_self).never

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)
  end

  test 'Should skip hosts that are not returned in query' do
    assert_nil InventorySync::InventoryStatus.where(host_id: @host3.id).first

    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)
    InventorySync::Async::InventoryFullSync.any_instance.expects(:affected_host_ids).returns([@host1.id, @host2.id])
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)
    @host2.reload

    assert_nil InventorySync::InventoryStatus.where(host_id: @host3.id).first
  end

  test 'user-omitted hosts get USER_OMITTED status' do
    # Add parameter to exclude host1
    @host1.host_parameters << HostParameter.create(
      name: 'host_registration_insights_inventory',
      value: 'false',
      parameter_type: 'boolean'
    )
    @host1.save!

    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)

    @host1.reload
    @host2.reload

    # Host1 should be USER_OMITTED
    assert_equal InventorySync::InventoryStatus::USER_OMITTED,
      InventorySync::InventoryStatus.where(host_id: @host1.id).first.status,
      'Host with host_registration_insights_inventory=false should have USER_OMITTED status'

    # Host2 should be SYNC
    assert_equal InventorySync::InventoryStatus::SYNC,
      InventorySync::InventoryStatus.where(host_id: @host2.id).first.status,
      'Normal host should have SYNC status'
  end

  test 'user-omitted hosts are not marked as disconnected' do
    # Add parameter to exclude host1
    @host1.host_parameters << HostParameter.create(
      name: 'host_registration_insights_inventory',
      value: 'false',
      parameter_type: 'boolean'
    )
    @host1.save!

    # Host1 is not in the cloud inventory response
    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)
    InventorySync::Async::InventoryFullSync.any_instance.expects(:affected_host_ids).returns([@host1.id, @host2.id])
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)

    @host1.reload

    # Host1 should be USER_OMITTED, not DISCONNECT
    assert_equal InventorySync::InventoryStatus::USER_OMITTED,
      InventorySync::InventoryStatus.where(host_id: @host1.id).first.status,
      'User-omitted host should have USER_OMITTED status even if not in cloud inventory'
  end

  test 'host_statuses output includes all three counts' do
    # Create a mix of hosts with different statuses
    # Host1: will be user-omitted
    @host1.host_parameters << HostParameter.create(
      name: 'host_registration_insights_inventory',
      value: 'false',
      parameter_type: 'boolean'
    )
    @host1.save!

    # Host2: will be synced (in cloud inventory)
    # Host3: will be disconnected (not in cloud inventory)

    # Create inventory response with only host2 (exclude host1 and host3)
    inventory_with_host2_only = @inventory.dup
    inventory_with_host2_only['results'] = [@inventory['results'][0]] # Only host2
    inventory_with_host2_only['total'] = 1
    inventory_with_host2_only['count'] = 1

    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(inventory_with_host2_only)
    InventorySync::Async::InventoryFullSync.any_instance.expects(:affected_host_ids).returns([@host1.id, @host2.id, @host3.id])
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)

    # Verify the statuses were actually set correctly
    @host1.reload
    @host2.reload
    @host3.reload

    assert_equal InventorySync::InventoryStatus::USER_OMITTED,
      InventorySync::InventoryStatus.where(host_id: @host1.id).first.status,
      'Host with host_registration_insights_inventory=false should have USER_OMITTED status'
    assert_equal InventorySync::InventoryStatus::SYNC,
      InventorySync::InventoryStatus.where(host_id: @host2.id).first.status,
      'Host in cloud inventory should have SYNC status'
    assert_equal InventorySync::InventoryStatus::DISCONNECT,
      InventorySync::InventoryStatus.where(host_id: @host3.id).first.status,
      'Host not in cloud inventory and not user-omitted should have DISCONNECT status'
  end

  test 'user-omitted status respects parameter inheritance from hostgroup' do
    # Create a hostgroup and assign it to host1
    hostgroup = FactoryBot.create(:hostgroup)
    hostgroup.organizations << @host1.organization
    @host1.hostgroup = hostgroup
    @host1.save!

    # Set parameter at hostgroup level, not directly on host
    # This verifies the fix that uses search_for instead of querying HostParameter directly
    hostgroup.group_parameters << GroupParameter.create(
      name: 'host_registration_insights_inventory',
      value: 'false',
      key_type: 'boolean'
    )
    hostgroup.save!

    # Verify parameter is inherited (not set directly on host)
    assert_nil @host1.parameters.find_by(name: 'host_registration_insights_inventory'),
      'Test setup: parameter should not be set directly on host'
    refute ::Foreman::Cast.to_bool(@host1.host_param('host_registration_insights_inventory')),
      'Test setup: parameter should be inherited from hostgroup'

    # Host2 remains normal (no parameter)
    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory)
    InventorySync::Async::InventoryFullSync.any_instance.expects(:affected_host_ids).returns([@host1.id, @host2.id])
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)

    @host1.reload
    @host2.reload

    # Host1 should be USER_OMITTED (inherited parameter from hostgroup)
    host1_status = InventorySync::InventoryStatus.where(host_id: @host1.id).first
    assert_not_nil host1_status, 'Host1 should have an inventory status'
    assert_equal InventorySync::InventoryStatus::USER_OMITTED, host1_status.status,
      'Host with inherited host_registration_insights_inventory=false should have USER_OMITTED status'

    # Host2 should be SYNC
    assert_equal InventorySync::InventoryStatus::SYNC,
      InventorySync::InventoryStatus.where(host_id: @host2.id).first.status,
      'Normal host should have SYNC status'
  end

  test 'user-omitted statuses are cleared before re-creating them to avoid silent create failures' do
    # First sync: host1 is user-omitted
    @host1.host_parameters << HostParameter.create(
      name: 'host_registration_insights_inventory',
      value: 'false',
      parameter_type: 'boolean'
    )
    @host1.save!

    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end
    InventorySync::Async::InventoryFullSync.any_instance.expects(:query_inventory).returns(@inventory).twice
    InventorySync::Async::InventoryFullSync.any_instance.expects(:affected_host_ids).returns([@host1.id, @host2.id]).twice
    FactoryBot.create(:fact_value, fact_name: fact_names['virt::uuid'], value: '1234', host: @host2)

    # Run first sync
    action = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action)

    @host1.reload
    initial_status = InventorySync::InventoryStatus.where(host_id: @host1.id).first
    assert_equal InventorySync::InventoryStatus::USER_OMITTED, initial_status.status,
      'Initial sync: host should be USER_OMITTED'
    initial_status_id = initial_status.id

    # Verify there's only one status record for host1
    assert_equal 1, InventorySync::InventoryStatus.where(host_id: @host1.id).count,
      'Should have exactly one status record after first sync'

    # Run second sync (parameter still false)
    # Without clearing old user_omitted statuses, the .create would silently fail
    # with 'Host has already been taken' due to uniqueness constraint
    setup_certs_expectation do
      InventorySync::Async::InventoryFullSync.any_instance.stubs(:candlepin_id_cert)
    end

    action2 = create_and_plan_action(InventorySync::Async::InventoryFullSync, @host1.organization)
    run_action(action2)

    @host1.reload
    final_status = InventorySync::InventoryStatus.where(host_id: @host1.id).first

    # Verify status is still USER_OMITTED (not stale from first sync)
    assert_equal InventorySync::InventoryStatus::USER_OMITTED, final_status.status,
      'Status should be USER_OMITTED after second sync'

    # Verify there's still only one status record (old one was deleted before creating new one)
    assert_equal 1, InventorySync::InventoryStatus.where(host_id: @host1.id).count,
      'Should have exactly one status record (old cleared before new created)'

    # Verify the old status record was actually deleted and replaced with a new one
    refute InventorySync::InventoryStatus.exists?(initial_status_id),
      'Old status record should have been deleted before creating new one'
    assert_not_equal initial_status_id, final_status.id,
      'New status record should have different ID, proving old was deleted'
  end
end
