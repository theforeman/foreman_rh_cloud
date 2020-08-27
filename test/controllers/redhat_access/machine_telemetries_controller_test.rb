require 'test_plugin_helper'

module RedhatAccess
  class MachineTelemetriesControllerTest < ActionController::TestCase
    setup do
      User.current = User.find_by(login: 'secret_admin')

      @env = FactoryBot.create(:katello_k_t_environment)
      cv = @env.content_views << FactoryBot.create(:katello_content_view, organization: @env.organization)

      @host = FactoryBot.create(
        :host,
        :with_subscription,
        :with_content,
        :with_hostgroup,
        :with_parameter,
        content_view: cv.first,
        lifecycle_environment: @env,
        organization: @env.organization
      )

      @host.subscription_facet.pools << FactoryBot.create(:katello_pool, account_number: '5678', cp_id: 1)

      uuid = @host.subscription_facet.uuid

      @user = ::Katello::CpConsumerUser.new({ :uuid => uuid, :login => uuid })

      @controller.stub(:set_client_user, @user) do
        User.current = @user
      end

      @controller.stubs(:cp_owner_id).returns('test-branch-id')
    end

    test 'should get branch info' do
      get :branch_info

      assert_response :success
    end

    test 'should handle missing organization' do
      Host::Managed.any_instance.stubs(:organization).returns(nil)
      get :branch_info

      res = JSON.parse(@response.body)
      assert_equal "Organization not found or invalid", res['message']
      assert_response 400
    end

    test 'should handle missing branch id' do
      @controller.stubs(:cp_owner_id).returns(nil)
      get :branch_info

      res = JSON.parse(@response.body)
      assert_equal "Branch ID not found for organization #{@host.organization.title}", res['message']
      assert_response 400
    end
  end
end
