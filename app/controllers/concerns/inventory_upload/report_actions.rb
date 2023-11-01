module InventoryUpload
  module ReportActions
    extend ActiveSupport::Concern

    class ReportMissingError < Foreman::Exception
      MESSAGE = N_("The report file %{filename} doesn't exist")

      def initialize(**params)
        super(self.class::MESSAGE % params, params)
      end
    end

    def start_report_generation(organization_id, disconnected)
      ForemanTasks.async_task(ForemanInventoryUpload::Async::GenerateReportJob, ForemanInventoryUpload.generated_reports_folder, organization_id, disconnected)
    end

    def report_file(organization_id)
      filename = ForemanInventoryUpload.facts_archive_name(organization_id)
      files = Dir["{#{ForemanInventoryUpload.uploads_file_path(filename)},#{ForemanInventoryUpload.done_file_path(filename)}}"]

      raise ReportMissingError.new(filename: filename) if files.empty?

      [filename, files.first]
    end
  end
end
