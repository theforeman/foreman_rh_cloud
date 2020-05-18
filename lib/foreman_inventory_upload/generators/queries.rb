module ForemanInventoryUpload
  module Generators
    class Queries
      def self.fact_names
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
              'lscpu::flags',
              'distribution::version',
              'distribution::id',
              'virt::is_guest',
              'dmi::system::manufacturer',
              'dmi::system::product_name',
              'dmi::chassis::asset_tag',
              'insights_client::obfuscate_hostname_enabled',
              'insights_client::hostname',
            ]).pluck(:name, :id)
          ]
      end

      def self.for_slice(base)
        fact_values = FactValue.where(fact_name_id: fact_names.values)
        base
          .joins(:subscription_facet)
          .eager_load(:fact_values)
          .preload(
            :interfaces,
            :installed_packages,
            :content_facet,
            :host_statuses,
            subscription_facet: [:pools, :installed_products, :hypervisor_host]
          )
          .merge(fact_values)
      end

      def self.for_report(portal_user)
        org_ids = organizations_for_user(portal_user).pluck(:id)
        for_slice(Host.unscoped.where(organization_id: org_ids)).in_batches(of: 1_000)
      end

      def self.for_org(organization_id)
        for_slice(Host.unscoped.where(organization_id: organization_id)).in_batches(of: 1_000)
      end

      def self.organizations_for_user(portal_user)
        Organization
          .joins(:telemetry_configuration)
          .where(
            redhat_access_telemetry_configurations: {
              portal_user: portal_user,
              enable_telemetry: true,
            }
          )
      end
    end
  end
end
