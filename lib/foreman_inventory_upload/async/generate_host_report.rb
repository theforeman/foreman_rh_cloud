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
        output[:result] = "Generated #{input[:target]} for organization id #{input[:organization_id]}"
      end
    end
  end
end
