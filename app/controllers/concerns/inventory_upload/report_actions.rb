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
      ensure_organization_access!(organization_id)
      upload = !disconnected
      ForemanTasks.async_task(
        ForemanInventoryUpload::Async::HostInventoryReportJob,
        ForemanInventoryUpload.generated_reports_folder,
        organization_id,
        "", # hosts_filter
        upload
      )
    end

    def report_file(organization_id)
      ensure_organization_access!(organization_id)
      filename = ForemanInventoryUpload.facts_archive_name(organization_id)
      if ForemanInventoryUpload.active_storage?
        report = ForemanInventoryUpload::Report.where(organization_id: organization_id, filename: filename).latest_first.first
        return [report.filename, report.archive] if report&.archive&.attached?
      end

      files = ForemanInventoryUpload.report_file_paths(organization_id)

      raise ReportMissingError.new(filename: filename) if files.empty?

      [filename, files.first]
    end

    def send_report(organization_id)
      filename, source = report_file(organization_id)
      return send_file(source, disposition: 'attachment', filename: filename) unless source.respond_to?(:download)

      response.headers['Content-Type'] = source.content_type || 'application/octet-stream'
      response.headers['Content-Length'] = source.byte_size.to_s
      response.headers['Content-Disposition'] = ActionDispatch::Http::ContentDisposition.format(
        disposition: 'attachment',
        filename: filename
      )
      self.response_body = Enumerator.new do |stream|
        source.download { |chunk| stream << chunk }
      end
    end

    private

    def ensure_organization_access!(organization_id)
      # UI requests do not validate organization_id through API set_taxonomy.
      User.current.my_organizations.find(organization_id)
    end
  end
end
