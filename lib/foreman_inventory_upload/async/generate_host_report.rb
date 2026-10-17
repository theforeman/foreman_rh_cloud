module ForemanInventoryUpload
  module Async
    class GenerateHostReport < ::Actions::EntryAction
      def plan(base_folder, organization_id, filter)
        plan_self(
          base_folder: base_folder,
          organization_id: organization_id,
          filter: filter,
          active_storage: ForemanInventoryUpload.active_storage?
        )
        input[:target] = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(input[:organization_id], input[:filter]))
      end

      def run
        return generate_stored_report if input[:active_storage]

        LegacyArchiveLock.synchronize(shared: true) do
          archived_report_generator = ForemanInventoryUpload::Generators::ArchivedReport.new(input[:target])
          archived_report_generator.render(organization: input[:organization_id], filter: input[:filter])
        end
        output[:result] = "Generated #{input[:target]} for organization id #{input[:organization_id]}"
      end

      private

      def generate_stored_report
        Dir.mktmpdir('inventory-archive') do |directory|
          path = File.join(directory, File.basename(input[:target]))
          ForemanInventoryUpload::Generators::ArchivedReport.new(path).render(organization: input[:organization_id], filter: input[:filter])
          report = ForemanInventoryUpload::Report.from_file!(
            path, organization_id: input[:organization_id], execution_plan_uuid: execution_plan_id
          )
          output[:report_id] = report.id
          output[:result] = "Generated #{report.filename} for organization id #{input[:organization_id]}"
          ForemanInventoryUpload::Report.prune_completed!(report.organization_id, report.filename)
        end
      end
    end
  end
end
