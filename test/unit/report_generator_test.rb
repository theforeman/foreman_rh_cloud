require 'test_plugin_helper'

class ReportGeneratorTest < ActiveSupport::TestCase
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
      'lscpu::flags'
    ]
  end

  def fact_names
    @fact_names ||= Hash[
      interesting_facts.map do |fact|
        [fact, FactoryBot.create(:fact_name, name: fact, type: 'Katello::RhsmFactName')]
      end
    ]
  end

  test 'generates an empty report' do
    generator = ForemanYupana::Report::Generator.new
    generator.expects(:batched_hosts).returns(Host.none.in_batches)

    json_str = generator.render
    actual = JSON.parse(json_str.join("\n"))

    assert_not_nil actual['report_id']
    assert_equal 'Satellite', actual['source']
    assert_equal [], actual['report_slices']
  end

  test 'generates a report for a single host' do
    generator = ForemanYupana::Report::Generator.new
    generator.expects(:batched_hosts).returns(Host.where(id: @host.id).in_batches)

    json_str = generator.render
    actual = JSON.parse(json_str.join("\n"))

    assert_not_nil actual['report_id']
    assert_equal 'Satellite', actual['source']
    assert_not_nil(slices = actual['report_slices'])
    assert_not_nil(slice = slices.first)
    assert_not_nil slice['report_slice_id']
    assert_not_nil(actual_host = slice['hosts'].first)
    assert_equal @host.name, actual_host['display_name']
    assert_equal @host.fqdn, actual_host['fqdn']
    assert_equal '1234', actual_host['account']
  end
end
