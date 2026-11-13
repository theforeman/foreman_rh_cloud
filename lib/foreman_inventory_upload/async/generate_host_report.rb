module ForemanInventoryUpload
  module Async
    class GenerateHostReport < ::Actions::EntryAction
      def plan(base_folder, organization_id, filter)
        plan_self(
          base_folder: base_folder,
          organization_id: organization_id,
          filter: filter
        )
        input[:target] = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(input[:organization_id], input[:filter]))
      end

      def run
        archived_report_generator = ForemanInventoryUpload::Generators::ArchivedReport.new(input[:target])
        archived_report_generator.render(organization: input[:organization_id], filter: input[:filter])
        ForemanInventoryUpload.log_inventory_report_saved(logger, input[:target])
        output[:result] = "Generated report for organization id #{input[:organization_id]}"
      end

      def logger
        Foreman::Logging.logger('background')
      end
    end
  end
end
