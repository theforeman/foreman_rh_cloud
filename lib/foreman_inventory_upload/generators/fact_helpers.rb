module ForemanInventoryUpload
  module Generators
    module FactHelpers
      extend ActiveSupport::Concern

      def fact_value(host, fact_name)
        value_record = host.fact_values.find do |fact_value|
          fact_value.fact_name_id == ForemanInventoryUpload::Generators::Queries.fact_names[fact_name]
        end
        value_record&.value
      end

      def kilobytes_to_bytes(kilobytes)
        kilobytes * 1024
      end

      def account_id(organization)
        @organization_accounts ||= {}
        @organization_accounts[organization.id] ||= organization.pools.where.not(account_number: nil).pluck(:account_number).first
      end

      def golden_ticket?(organization)
        result = organization.try(:golden_ticket?)
        result = organization.content_access_mode == 'org_environment' if result.nil?

        @organization_golden_tickets ||= {}
        @organization_golden_tickets[organization.id] ||= result
      end
    end
  end
end
