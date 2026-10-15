module ForemanInventoryUpload
  module Async
    class QueueForUploadJob < ::Actions::EntryAction
      def plan(report_or_base_folder, report_file_or_organization_id, organization_id = nil)
        if organization_id
          enqueue_task = plan_self(base_folder: report_or_base_folder, report_file: report_file_or_organization_id)
          plan_upload_report(enqueue_task.output[:enqueued_file_name], organization_id, legacy: true)
        else
          enqueue_task = plan_self(report_id: report_or_base_folder, organization_id: report_file_or_organization_id)
          plan_upload_report(enqueue_task.output[:report_id], report_file_or_organization_id)
        end
      end

      def run
        return enqueue_legacy_file unless input[:report_id]

        report = ForemanInventoryUpload::Report.where(organization_id: input[:organization_id]).find(input[:report_id])
        report.uploading!
        output[:report_id] = report.id
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def plan_upload_report(report_id, organization_id, legacy: false)
        source = legacy ? report_id : { report_id: report_id }
        plan_action(UploadReportDirectJob, source, organization_id)
      end

      def enqueue_legacy_file
        LegacyArchiveLock.synchronize(shared: true) do
          FileUtils.mkdir_p(ForemanInventoryUpload.uploads_folder)
          enqueued_file_name = ForemanInventoryUpload.uploads_file_path(input[:report_file])
          FileUtils.mv(File.join(input[:base_folder], input[:report_file]), enqueued_file_name)
          output[:enqueued_file_name] = enqueued_file_name
        end
      end
    end
  end
end
