module ForemanInventoryUpload
  module Generators
    class Slice
      attr_accessor :slice_id

      def initialize(hosts, output = [], slice_id = Foreman.uuid)
        @stream = JsonStream.new(output)
        @hosts = hosts
        @slice_id = slice_id
      end

      def render
        report_slice(@hosts)
        @stream.out
      end

      private

      def report_slice(hosts_batch)
        @stream.object do
          @stream.simple_field('report_slice_id', @slice_id)
          @stream.array_field('hosts', :last) do
            first = true
            hosts_batch.each do |host|
              next unless host&.subscription_facet&.pools&.first
              @stream.comma unless first
              first = false if report_host(host)
            end
          end
        end
      end

      def report_host(host)
        @stream.object do
          @stream.simple_field('display_name', host.name)
          @stream.simple_field('fqdn', host.fqdn)
          @stream.simple_field('account', host.subscription_facet.pools.first.account_number.to_s)
          @stream.simple_field('subscription_manager_id', host.subscription_facet.uuid)
          @stream.simple_field('satellite_id', host.subscription_facet.uuid)
          @stream.simple_field('bios_uuid', fact_value(host, 'dmi::system::uuid'))
          @stream.simple_field('vm_uuid', fact_value(host, 'virt::uuid'))
          @stream.array_field('ip_addresses') do
            @stream.raw(host.interfaces.map do |nic|
              @stream.stringify_value(nic.ip) if nic.ip
            end.compact.join(', '))
          end
          @stream.array_field('mac_addresses') do
            @stream.raw(host.interfaces.map do |nic|
              @stream.stringify_value(nic.mac) if nic.mac
            end.compact.join(', '))
          end
          @stream.object_field('system_profile') do
            report_system_profile(host)
          end
          @stream.array_field('facts') do
            @stream.object do
              @stream.simple_field('namespace', 'satellite')
              @stream.object_field('facts', :last) do
                report_satellite_facts(host)
              end
            end
          end

          @stream.array_field('tags', :last) do
            report_tag('satellite', 'satellite_instance_id', Foreman.instance_id) if Foreman.respond_to?(:instance_id)
            report_tag('satellite', 'organization_id', host.organization_id, :last)
          end
        end
      end

      def report_tag(namespace, key, value, last = nil)
        @stream.object do
          @stream.simple_field('namespace', namespace)
          @stream.simple_field('key', key)
          @stream.simple_field('value', value, :last)
        end
        @stream.comma unless last
      end

      def report_system_profile(host)
        @stream.simple_field('number_of_cpus', fact_value(host, 'cpu::cpu(s)').to_i)
        @stream.simple_field('number_of_sockets', fact_value(host, 'cpu::cpu_socket(s)').to_i)
        @stream.simple_field('cores_per_socket', fact_value(host, 'cpu::core(s)_per_socket').to_i)
        @stream.simple_field('system_memory_bytes', fact_value(host, 'memory::memtotal').to_i)
        @stream.array_field('network_interfaces') do
          @stream.raw(host.interfaces.map do |nic|
            {
              'ipv4_addresses': [nic.ip].compact,
              'ipv6_addresses': [nic.ip6].compact,
              'mtu': nic.mtu,
              'mac_address': nic.mac,
              'name': nic.identifier,
            }.compact.to_json
          end.join(', '))
        end
        @stream.simple_field('bios_vendor', fact_value(host, 'dmi::bios::vendor'))
        @stream.simple_field('bios_version', fact_value(host, 'dmi::bios::version'))
        @stream.simple_field('bios_release_date', fact_value(host, 'dmi::bios::relase_date'))
        if (cpu_flags = fact_value(host, 'lscpu::flags'))
          @stream.array_field('cpu_flags') do
            @stream.raw(cpu_flags.split.map do |flag|
              @stream.stringify_value(flag)
            end.join(', '))
          end
        end
        @stream.simple_field('os_release', fact_value(host, 'distribution::name'))
        @stream.simple_field('os_kernel_version', fact_value(host, 'uname::release'))
        @stream.simple_field('arch', host.architecture&.name)
        @stream.simple_field('subscription_status', host.subscription_status_label)
        @stream.simple_field('katello_agent_running', host.content_facet&.katello_agent_installed?)
        @stream.simple_field('satellite_managed', true)
        unless (installed_products = host.subscription_facet&.installed_products).empty?
          @stream.array_field('installed_products') do
            @stream.raw(installed_products.map do |product|
              {
                'name': product.name,
                'id': product.cp_product_id,
              }.to_json
            end.join(', '))
          end
        end
        @stream.array_field('installed_packages', :last) do
          first = true
          host.installed_packages.each do |package|
            @stream.raw("#{first ? '' : ', '}#{@stream.stringify_value(package.nvra)}")
            first = false
          end
        end
      end

      def report_satellite_facts(host)
        @stream.simple_field('virtual_host_name', host.subscription_facet.hypervisor_host&.name)
        @stream.simple_field('virtual_host_uuid', host.subscription_facet.hypervisor_host&.subscription_facet&.uuid)
        if defined?(ForemanThemeSatellite)
          @stream.simple_field('satellite_version', ForemanThemeSatellite::SATELLITE_VERSION)
        end
        @stream.simple_field('system_purpose_usage', host.subscription_facet.purpose_usage)
        @stream.simple_field('system_purpose_role', host.subscription_facet.purpose_role)
        @stream.simple_field('distribution_version', fact_value(host, 'distribution::version'))
        @stream.simple_field('satellite_instance_id', Foreman.respond_to?(:instance_id) ? Foreman.instance_id : nil)
        @stream.simple_field('organization_id', host.organization_id, :last)
      end

      def fact_value(host, fact_name)
        value_record = host.fact_values.find do |fact_value|
          fact_value.fact_name_id == ForemanInventoryUpload::Generators::Queries.fact_names[fact_name]
        end
        value_record&.value
      end
    end
  end
end
