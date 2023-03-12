require 'test_plugin_helper'

class ArchivedReportGeneratorTest < ActiveSupport::TestCase
  include MockForemanHostname

  setup do
    User.current = User.find_by(login: 'secret_admin')

    env = FactoryBot.create(:katello_k_t_environment)
    cv = env.content_views << FactoryBot.create(:katello_content_view, organization: env.organization)

    @host = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: cv.first,
      lifecycle_environment: env,
      organization: env.organization
    )

    @host.subscription_facet.pools << FactoryBot.create(:katello_pool, account_number: '1234', cp_id: 1)
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
      'distribution::name',
      'uname::release',
      'lscpu::flags',
    ]
  end

  def fact_names
    @fact_names ||= Hash[
      interesting_facts.map do |fact|
        [fact, FactoryBot.create(:fact_name, name: fact, type: 'Katello::RhsmFactName')]
      end
    ]
  end

  test 'generates a report for a single host' do
    batches = Host.where(id: @host.id).in_batches
    test_org = FactoryBot.create(:organization)

    ForemanInventoryUpload::Generators::Queries.expects(:for_org).with(test_org.id).returns(batches)
    ForemanInventoryUpload::Generators::Slice.any_instance.stubs(:golden_ticket?).returns(false)
    Dir.mktmpdir do |tmpdir|
      target = File.join(tmpdir, 'test.tar.gz')
      generator = ForemanInventoryUpload::Generators::ArchivedReport.new(target, Logger.new(STDOUT))
      generator.render(organization: test_org.id)

      files = Dir["#{tmpdir}/*"]
      assert_equal "#{tmpdir}/test.tar.gz", files.first
    end
  end
end
