require 'test_plugin_helper'
require 'json'

class TagsAuthTest < ActiveSupport::TestCase
  setup do
    @user = FactoryBot.build(:user)
    @logger = Logger.new(IO::NULL)
    @org = FactoryBot.build(:organization)
    @loc = FactoryBot.build(:location)
    @auth = ::ForemanRhCloud::TagsAuth.new(@user, @org, @loc, @logger)
  end

  test 'Generates tags update request' do
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
end
