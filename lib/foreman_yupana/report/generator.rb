module ForemanYupana
  module Report
    class Generator
      def initialize(output = [])
        @out = output
      end

      def render
        render_report
        @out
      end

      private

      def fact_names
        @fact_names ||= Hash[
          Katello::RhsmFactName.where(name:
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
            ]).pluck(:name, :id)
          ]
      end

      def render_report
        object do
          simple_field('report_id', Foreman.uuid)
          simple_field('source', 'Satellite')
          array_field('report_slices', :last) do
            first = true
            batched_hosts.each do |hosts_batch|
              @out << ', ' unless first
              first = false
              report_slice(hosts_batch)
            end
          end
        end
      end

      def report_slice(hosts_batch)
        object do
          simple_field('report_slice_id', Foreman.uuid)
          array_field('hosts', :last) do
            first = true
            hosts_batch.each do |host|
              @out << ', ' unless first
              first = false
              report_host(host)
            end
          end
        end
      end

      def report_host(host)
        object do
          simple_field('display_name', host.name)
          simple_field('fqdn', host.fqdn)
          simple_field('account', host.subscription_facet.pools.first.account_number.to_s)
          simple_field('subscription_manager_id', host.subscription_facet.uuid)
          simple_field('satellite_id', host.subscription_facet.uuid)
          simple_field('bios_uuid', fact_value(host, 'dmi::system::uuid'))
          simple_field('vm_uuid', fact_value(host, 'virt::uuid'))
          array_field('ip_addresses') do
            @out << host.interfaces.map do |nic|
              stringify_value(nic.ip)
            end.join(', ')
          end
          array_field('mac_addresses') do
            @out << host.interfaces.map do |nic|
              stringify_value(nic.mac)
            end.join(', ')
          end
          object_field('system_profile', :last) do
            report_system_profile(host)
          end
        end
      end

      def report_system_profile(host)
        simple_field('number_of_cpus', fact_value(host, 'cpu::cpu(s)').to_i)
        simple_field('number_of_sockets', fact_value(host, 'cpu::cpu_socket(s)').to_i)
        simple_field('cores_per_socket', fact_value(host, 'cpu::core(s)_per_socket').to_i)
        simple_field('system_memory_bytes', fact_value(host, 'memory::memtotal').to_i)
        array_field('network_interfaces') do
          @out << host.interfaces.map do |nic|
            {
              'ipv4_addresses': [nic.ip].compact,
              'ipv6_addresses': [nic.ip6].compact,
              'mtu': nic.mtu,
              'mac_address': nic.mac,
              'name': nic.identifier
            }.to_json
          end.join(', ')
        end
        simple_field('bios_vendor', fact_value(host, 'dmi::bios::vendor'))
        simple_field('bios_version', fact_value(host, 'dmi::bios::version'))
        simple_field('bios_release_date', fact_value(host, 'dmi::bios::relase_date'))
        array_field('cpu_flags') do
          @out << fact_value(host, 'lscpu::flags').split.map do |flag|
            stringify_value(flag)
          end.join(', ')
        end
        simple_field('os_release', fact_value(host, 'distribution::name'))
        simple_field('os_kernel_version', fact_value(host, 'uname::release'))
        simple_field('arch', host.architecture.name)
        simple_field('subscription_status', host.subscription_status_label)
        simple_field('katello_agent_running', host.content_facet.katello_agent_installed?)
        simple_field('satellite_managed', true)
        array_field('installed_products') do
          @out << host.subscription_facet.installed_products.map do |product|
            {
              'name': product.name,
              'id': product.cp_product_id
            }.to_json
          end.join(', ')
        end
        array_field('installed_packages', :last) do
          first = true
          host.installed_packages.each do |package|
            @out << "#{first ? '' : ', '}#{stringify_value(package.nvra)}"
            first = false
          end
        end
      end

      def batched_hosts
        fact_values = FactValue.where(fact_name_id: fact_names.values)
        Host
          .joins(:subscription_facet)
          .eager_load(:fact_values)
          .preload(
            :interfaces,
            :installed_packages,
            :content_facet,
            :host_statuses,
            subscription_facet: %i[pools installed_products]
          )
          .merge(fact_values)
          .in_batches(of: 1_000)
      end

      def fact_value(host, fact_name)
        value_record = host.fact_values.find { |fact_value| fact_value.fact_name_id == fact_names[fact_name] }
        value_record.value
      end

      def array
        @out << '['
        yield
        @out << ']'
      end

      def object
        @out << '{'
        yield
        @out << '}'
      end

      def simple_field(name, value, last = false)
        @out << "\"#{name}\": #{stringify_value(value)}#{last ? '' : ','}"
      end

      def array_field(name, last = false, &block)
        @out << "\"#{name}\": "
        array(&block)
        @out << ',' unless last
      end

      def object_field(name, last = false, &block)
        @out << "\"#{name}\": "
        object(&block)
        @out << ',' unless last
      end

      def stringify_value(value)
        return value if value.is_a?(Integer)
        return value if value.is_a?(TrueClass)
        return value if value.is_a?(FalseClass)

        "\"#{value}\""
      end
    end
  end
end
