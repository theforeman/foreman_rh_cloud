require 'test_plugin_helper'
require 'json'

class TagsAuthTest < ActiveSupport::TestCase
  setup do
    Rails.cache.clear
    @user = FactoryBot.build(:user)
    @logger = Logger.new(IO::NULL)
    @org = FactoryBot.build(:organization)
    @loc = FactoryBot.build(:location)
    @auth = ::ForemanRhCloud::TagsAuth.new(@user, @org, @loc, @logger)
  end

  test 'Generates tags update request when hosts are present' do
    uuid1 = 'test_uuid1'
    uuid2 = 'test_uuid2'

    @auth.expects(:allowed_hosts).returns([uuid1, uuid2])
    @auth.expects(:execute_cloud_request).with do |actual_params|
      actual = JSON.parse(actual_params[:payload])
      assert_includes actual['host_id_list'], uuid1
      assert_includes actual['host_id_list'], uuid2
      assert_equal ForemanRhCloud::TagsAuth::TAG_SHORT_NAME, actual['tags'].first['key']
      assert_equal ForemanRhCloud::TagsAuth::TAG_NAMESPACE, actual['tags'].first['namespace']
      assert_equal "U:\"#{@user.login}\"O:\"#{@org.name}\"L:\"#{@loc.name}\"", actual['tags'].first['value']
    end

    @auth.update_tag
  end

  test 'Should not execute cloud request when no hosts are present' do
    @auth.expects(:allowed_hosts).returns([])
    @auth.expects(:execute_cloud_request).never

    @auth.update_tag
  end

  test 'Should not execute cloud request when allowed_hosts is nil' do
    @auth.expects(:allowed_hosts).returns(nil)
    @auth.expects(:execute_cloud_request).never

    @auth.update_tag
  end

  test 'Does not repeat cloud request for the same user/org/location within the sync TTL' do
    @auth.stubs(:allowed_hosts).returns(['test_uuid1'])
    @auth.expects(:execute_cloud_request).once

    @auth.update_tag
    @auth.update_tag
  end

  test 'Serializes sync through an advisory lock on a cold cache miss' do
    @auth.stubs(:allowed_hosts).returns(['test_uuid1'])
    Foreman::AdvisoryLockManager.expects(:with_session_lock).yields

    @auth.update_tag
  end

  test 'Skips the advisory lock entirely on a warm cache hit' do
    @auth.stubs(:allowed_hosts).returns(['test_uuid1'])
    @auth.update_tag

    Foreman::AdvisoryLockManager.expects(:with_session_lock).never
    @auth.update_tag
  end

  test 'Generates tags with wildcard location when location is nil' do
    auth_with_nil_loc = ::ForemanRhCloud::TagsAuth.new(@user, @org, nil, @logger)
    uuid1 = 'test_uuid1'

    auth_with_nil_loc.expects(:allowed_hosts).returns([uuid1])
    auth_with_nil_loc.expects(:execute_cloud_request).with do |actual_params|
      actual = JSON.parse(actual_params[:payload])
      assert_includes actual['host_id_list'], uuid1
      assert_equal "U:\"#{@user.login}\"O:\"#{@org.name}\"L:\"*\"", actual['tags'].first['value']
    end

    auth_with_nil_loc.update_tag
  end
end
