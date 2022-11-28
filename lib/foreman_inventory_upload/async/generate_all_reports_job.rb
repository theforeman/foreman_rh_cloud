module ForemanInventoryUpload
  module Async
    class GenerateAllReportsJob < ::Actions::EntryAction
      include ::Actions::RecurringAction
      include ForemanInventoryUpload::Async::DelayedStart

      def plan
        unless Setting[:allow_auto_inventory_upload]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_inventory_upload"
            setting being set to false.'
          )
          return
        end

        after_delay do
          organizations = Organization.unscoped.all

          organizations.map do |organization|
            total_hosts = ForemanInventoryUpload::Generators::Queries.for_org(organization.id, use_batches: false).count

            if total_hosts <= ForemanInventoryUpload.max_org_size
              plan_generate_report(ForemanInventoryUpload.generated_reports_folder, organization)
            else
              logger.info("Skipping automatic uploads for organization #{organization.name}, too many hosts (#{total_hosts}/#{ForemanInventoryUpload.max_org_size})")
            end
          end.compact
        end
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      def plan_generate_report(folder, organization)
        plan_action(ForemanInventoryUpload::Async::GenerateReportJob, folder, organization.id)
      end

      def logger
        action_logger
      end
    end
  end
end
