module ForemanYupana
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
              'lscpu::flags'
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
            subscription_facet: %i[pools installed_products]
          )
          .merge(fact_values)
      end

      def self.for_report(portal_user)
        org_ids = Organization
                  .where(
                    telemetry_configuration: {
                      portal_user: portal_user,
                      enable_telemetry: true
                    }
                  ).select(:id)
        for_slice(Host.where(organization_id: org_ids)).in_batches(of: 1_000)
      end
    end
  end
end
