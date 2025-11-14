module ForemanInventoryUpload
  module Async
    class QueueForUploadJob < ::Actions::EntryAction
      def plan(base_folder, report_file, organization_id)
        enqueue_task = plan_self(base_folder: base_folder, report_file: report_file)
        plan_upload_report(enqueue_task.output[:enqueued_file_name], organization_id)
      end

      def run
        logger.debug('Ensuring objects')
        ensure_ouput_folder
        logger.debug("Copying #{report_file} to #{uploads_folder}")
        enqueued_file_name = File.join(uploads_folder, report_file)
        FileUtils.mv(File.join(base_folder, report_file), enqueued_file_name)
        logger.debug("Done copying #{report_file} to #{enqueued_file_name}")

        output[:enqueued_file_name] = enqueued_file_name
      end

      def uploads_folder
        @uploads_folder ||= ForemanInventoryUpload.uploads_folder
      end

      def ensure_ouput_folder
        FileUtils.mkdir_p(uploads_folder)
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def base_folder
        input[:base_folder]
      end

      def report_file
        input[:report_file]
      end

      def plan_upload_report(enqueued_file_name, organization_id)
        plan_action(UploadReportDirectJob, enqueued_file_name, organization_id)
      end
    end
  end
end
