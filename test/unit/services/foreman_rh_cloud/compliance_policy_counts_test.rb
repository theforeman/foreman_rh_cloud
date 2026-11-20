require 'test_plugin_helper'

class CompliancePolicyCountsTest < ActiveSupport::TestCase
  test 'counts policies across pages' do
    org = FactoryBot.create(:organization)
    user = FactoryBot.create(:user)
    ForemanRhCloud::TagsAuth.stubs(:new).returns(stub('tags', update_tag: true))
    ForemanRhCloud::TagsAuth.stubs(:auth_tag_for).returns('sat_iam/scope=test')

    service = ForemanRhCloud::CompliancePolicyCounts.new(user, org, nil)
    page_one = stub(body: {
      'data' => [{ 'id' => 'uuid-a', 'policies' => [{ 'title' => 'A' }, { 'title' => 'B' }] }],
      'meta' => { 'total' => 101 },
    }.to_json)
    page_two = stub(body: {
      'data' => [{ 'id' => 'uuid-b', 'policies' => [] }],
      'meta' => { 'total' => 101 },
    }.to_json)
    service.stubs(:execute_cloud_request).returns(page_one, page_two)

    assert_equal({ 'uuid-a' => 2, 'uuid-b' => 0 }, service.fetch)
  end

  test 'does not request another page when the first page already contains every system' do
    org = FactoryBot.create(:organization)
    user = FactoryBot.create(:user)
    ForemanRhCloud::TagsAuth.stubs(:new).returns(stub('tags', update_tag: true))
    ForemanRhCloud::TagsAuth.stubs(:auth_tag_for).returns('sat_iam/scope=test')

    service = ForemanRhCloud::CompliancePolicyCounts.new(user, org, nil)
    page = stub(body: {
      'data' => [{ 'id' => 'uuid-a', 'policies' => [{ 'title' => 'A' }] }],
      'meta' => { 'total' => 11 },
    }.to_json)
    service.expects(:execute_cloud_request).once.returns(page)

    assert_equal({ 'uuid-a' => 1 }, service.fetch)
  end

  test 'requires an organization' do
    service = ForemanRhCloud::CompliancePolicyCounts.new(nil, nil, nil)

    error = assert_raises(ScopedSearch::QueryNotSupported) do
      service.fetch
    end

    assert_match(/organization/, error.message)
  end
end
