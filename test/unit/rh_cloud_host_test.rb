require 'test_plugin_helper'

class RhCloudHostTest < ActiveSupport::TestCase
  setup do
    @org = FactoryBot.create(:organization)
  end

  teardown do
    ForemanRhCloud.unstub(:with_iop_smart_proxy?)
  end

  context 'insights_uuid method' do
    test 'returns insights_facet uuid in non-IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'insights-123')

      assert_equal 'insights-123', @host.insights_uuid
      assert_not_equal @host.subscription_facet.uuid, @host.insights_uuid
    end

    test 'returns subscription_facet uuid in IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'insights-456')

      assert_equal @host.subscription_facet.uuid, @host.insights_uuid
      assert_not_equal 'insights-456', @host.insights_uuid
    end

    test 'returns nil when insights_facet missing in non-IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      assert_nil @host.insights_uuid
    end

    test 'returns nil when subscription_facet missing in IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      @host = FactoryBot.create(:host, :managed, organization: @org)
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'insights-789')

      assert_nil @host.insights_uuid
    end

    test 'returns nil when both facets missing' do
      @host = FactoryBot.create(:host, :managed, organization: @org)

      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      assert_nil @host.insights_uuid

      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      assert_nil @host.insights_uuid
    end

    test 'never returns stale insights_facet uuid in IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      current_uuid = @host.subscription_facet.uuid
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'stale-456')

      # Should return subscription_facet UUID, never the stale insights_facet UUID
      assert_equal current_uuid, @host.insights_uuid
      assert_not_equal 'stale-456', @host.insights_uuid

      # Verify multiple calls always return subscription_facet UUID
      3.times do
        assert_equal current_uuid, @host.insights_uuid
      end
    end

    test 'dynamically responds to IoP mode changes' do
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'insights-123')
      subscription_uuid = @host.subscription_facet.uuid

      # Non-IoP mode: should return insights_facet UUID
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      assert_equal 'insights-123', @host.insights_uuid

      # IoP mode: should return subscription_facet UUID
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      assert_equal subscription_uuid, @host.insights_uuid

      # Toggle back to non-IoP mode
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      assert_equal 'insights-123', @host.insights_uuid
    end
  end

  context 'ensure_iop_insights_uuid method' do
    test 'updates insights_facet uuid when different from subscription_facet' do
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      correct_uuid = @host.subscription_facet.uuid
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'wrong-456')

      assert_equal 'wrong-456', @host.insights_facet.uuid

      @host.ensure_iop_insights_uuid

      assert_equal correct_uuid, @host.insights_facet.reload.uuid
    end

    test 'does nothing when uuids already match' do
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      matching_uuid = @host.subscription_facet.uuid
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: matching_uuid)

      # Expect no update call since UUIDs already match
      @host.insights_facet.expects(:update!).never

      @host.ensure_iop_insights_uuid

      assert_equal matching_uuid, @host.insights_facet.uuid
    end

    test 'does nothing when insights_facet missing' do
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      assert_nothing_raised do
        @host.ensure_iop_insights_uuid
      end
    end

    test 'does nothing when subscription_facet missing' do
      @host = FactoryBot.create(:host, :managed, organization: @org)
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'insights-999')
      original_uuid = @host.insights_facet.uuid

      assert_nothing_raised do
        @host.ensure_iop_insights_uuid
      end

      assert_equal original_uuid, @host.insights_facet.uuid
    end

    test 'does nothing when both facets missing' do
      @host = FactoryBot.create(:host, :managed, organization: @org)

      assert_nothing_raised do
        @host.ensure_iop_insights_uuid
      end
    end

    test 'handles nil uuids gracefully' do
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      # Scenario 1: subscription_facet uuid is nil (shouldn't happen but test gracefully)
      @host.subscription_facet.update(uuid: nil)
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'some-uuid')

      assert_nothing_raised do
        @host.ensure_iop_insights_uuid
      end

      # Scenario 2: insights_facet uuid is nil
      @host.subscription_facet.update(uuid: 'valid-uuid')
      @host.insights_facet.update(uuid: nil)

      assert_nothing_raised do
        @host.ensure_iop_insights_uuid
      end

      # Should update to match subscription_facet
      assert_equal 'valid-uuid', @host.insights_facet.reload.uuid
    end

    test 'corrects stale uuid after cloud registration' do
      # Simulate a host that was previously registered to cloud with cloud-assigned UUID
      @host = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      local_uuid = @host.subscription_facet.uuid
      @host.insights = FactoryBot.create(:insights_facet, host_id: @host.id, uuid: 'cloud-456')

      # Before sync: insights_facet has stale cloud UUID
      assert_equal 'cloud-456', @host.insights_facet.uuid

      # In IoP mode, insights_uuid should return subscription_facet UUID (not stale)
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      assert_equal local_uuid, @host.insights_uuid

      # Call sync to correct the stale UUID
      @host.ensure_iop_insights_uuid

      # After sync: insights_facet UUID should match subscription_facet UUID
      assert_equal local_uuid, @host.insights_facet.reload.uuid

      # Verify insights_uuid still returns correct value
      assert_equal local_uuid, @host.insights_uuid
    end
  end

  context 'scoped search on insights_uuid' do
    setup do
      @org = FactoryBot.create(:organization)
    end

    teardown do
      ForemanRhCloud.unstub(:with_iop_smart_proxy?)
    end

    test 'searches insights_facet.uuid in non-IoP mode with = operator' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      host1 = FactoryBot.create(:host, :managed, organization: @org)
      host1.insights = FactoryBot.create(:insights_facet, host_id: host1.id, uuid: 'insights-uuid-123')
      host2 = FactoryBot.create(:host, :managed, organization: @org)
      host2.insights = FactoryBot.create(:insights_facet, host_id: host2.id, uuid: 'insights-uuid-456')

      results = Host::Managed.search_for('insights_uuid = insights-uuid-123')

      assert_includes results, host1
      assert_not_includes results, host2
    end

    test 'searches subscription_facet.uuid in IoP mode with = operator' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      host1 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      host2 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      # Even if insights_facet has different UUID, should use subscription_facet UUID
      host1.insights = FactoryBot.create(:insights_facet, host_id: host1.id, uuid: 'stale-123')

      results = Host::Managed.search_for("insights_uuid = #{host1.subscription_facet.uuid}")

      assert_includes results, host1
      assert_not_includes results, host2
    end

    test 'searches with ^ operator (IN) in non-IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      host1 = FactoryBot.create(:host, :managed, organization: @org)
      host1.insights = FactoryBot.create(:insights_facet, host_id: host1.id, uuid: 'uuid-1')
      host2 = FactoryBot.create(:host, :managed, organization: @org)
      host2.insights = FactoryBot.create(:insights_facet, host_id: host2.id, uuid: 'uuid-2')
      host3 = FactoryBot.create(:host, :managed, organization: @org)
      host3.insights = FactoryBot.create(:insights_facet, host_id: host3.id, uuid: 'uuid-3')

      results = Host::Managed.search_for('insights_uuid ^ (uuid-1,uuid-2)')

      assert_includes results, host1
      assert_includes results, host2
      assert_not_includes results, host3
    end

    test 'searches with ^ operator (IN) in IoP mode - THE BUG FIX' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      host1 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      host2 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      host3 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      # Create insights facets with stale UUIDs to verify we're using subscription_facet
      host1.insights = FactoryBot.create(:insights_facet, host_id: host1.id, uuid: 'stale-1')
      host2.insights = FactoryBot.create(:insights_facet, host_id: host2.id, uuid: 'stale-2')
      host3.insights = FactoryBot.create(:insights_facet, host_id: host3.id, uuid: 'stale-3')

      uuid1 = host1.subscription_facet.uuid
      uuid2 = host2.subscription_facet.uuid

      # This is the search query that remediation modal creates
      results = Host::Managed.search_for("insights_uuid ^ (#{uuid1},#{uuid2})")

      # Should find hosts by subscription_facet UUID, not insights_facet UUID
      assert_includes results, host1
      assert_includes results, host2
      assert_not_includes results, host3
    end

    test 'searches with !^ operator (NOT IN) in non-IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      host1 = FactoryBot.create(:host, :managed, organization: @org)
      host1.insights = FactoryBot.create(:insights_facet, host_id: host1.id, uuid: 'uuid-1')
      host2 = FactoryBot.create(:host, :managed, organization: @org)
      host2.insights = FactoryBot.create(:insights_facet, host_id: host2.id, uuid: 'uuid-2')
      host3 = FactoryBot.create(:host, :managed, organization: @org)
      host3.insights = FactoryBot.create(:insights_facet, host_id: host3.id, uuid: 'uuid-3')

      results = Host::Managed.search_for('insights_uuid !^ (uuid-1,uuid-2)')

      assert_not_includes results, host1
      assert_not_includes results, host2
      assert_includes results, host3
    end

    test 'searches with !^ operator (NOT IN) in IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      host1 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      host2 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      host3 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      uuid1 = host1.subscription_facet.uuid
      uuid2 = host2.subscription_facet.uuid

      results = Host::Managed.search_for("insights_uuid !^ (#{uuid1},#{uuid2})")

      assert_not_includes results, host1
      assert_not_includes results, host2
      assert_includes results, host3
    end

    test 'handles hosts without facets in non-IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      host_without_facet = FactoryBot.create(:host, :managed, organization: @org)
      host_with_facet = FactoryBot.create(:host, :managed, organization: @org)
      host_with_facet.insights = FactoryBot.create(:insights_facet, host_id: host_with_facet.id, uuid: 'uuid-1')

      results = Host::Managed.search_for('insights_uuid = uuid-1')

      assert_includes results, host_with_facet
      assert_not_includes results, host_without_facet
    end

    test 'handles hosts without subscription_facet in IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      host_without_sub = FactoryBot.create(:host, :managed, organization: @org)
      host_with_sub = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)

      uuid = host_with_sub.subscription_facet.uuid

      results = Host::Managed.search_for("insights_uuid = #{uuid}")

      assert_includes results, host_with_sub
      assert_not_includes results, host_without_sub
    end

    test 'mode changes are reflected in searches' do
      host1 = FactoryBot.create(:host, :managed, :with_subscription, organization: @org)
      host1.insights = FactoryBot.create(:insights_facet, host_id: host1.id, uuid: 'insights-uuid-abc')
      insights_uuid = 'insights-uuid-abc'
      subscription_uuid = host1.subscription_facet.uuid

      # Non-IoP mode: should find by insights_facet UUID
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
      results = Host::Managed.search_for("insights_uuid = #{insights_uuid}")
      assert_includes results, host1

      # IoP mode: should find by subscription_facet UUID
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
      results = Host::Managed.search_for("insights_uuid = #{subscription_uuid}")
      assert_includes results, host1

      # Should NOT find by old insights_facet UUID in IoP mode
      results = Host::Managed.search_for("insights_uuid = #{insights_uuid}")
      assert_not_includes results, host1
    end
  end
end
