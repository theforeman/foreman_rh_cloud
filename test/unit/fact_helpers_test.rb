require 'test_plugin_helper'

class FactHelpersTest < ActiveSupport::TestCase
  class FactsHelpersTestStub
    include ForemanInventoryUpload::Generators::FactHelpers
  end

  setup do
    @instance = FactsHelpersTestStub.new

    @org = FactoryBot.create(:organization)
  end

  test 'golden_ticket uses golden_ticket method when defined' do
    @org.expects(:golden_ticket?).returns(true)

    actual = @instance.golden_ticket?(@org)

    assert actual
  end

  test 'golden_ticket uses content_access_mode method when golden_ticket not defined' do
    @org.expects(:content_access_mode).returns('org_environment')

    actual = @instance.golden_ticket?(@org)

    assert actual
  end
end
