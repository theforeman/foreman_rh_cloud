module InsightsCloud
  module PackageProfileUploadExtensions
    extend ActiveSupport::Concern

    included do
      # This method explicitly listens on Katello actions
      # rubocop:disable Rails/LexicallyScopedActionFilter
      after_action :generate_host_report, only: [:upload_package_profile, :upload_profiles]
      # rubocop:enable Rails/LexicallyScopedActionFilter
    end

    def generate_host_report
      return unless ForemanRhCloud.with_local_advisor_engine?

      logger.debug("Generating host-specific report for host #{@host.name}")

      ForemanTasks.async_task(
        ForemanInventoryUpload::Async::GenerateReportJob,
        ForemanInventoryUpload.generated_reports_folder,
        @host.organization_id,
        false,
        "id=#{@host.id}"
      )

      # in IoP case, the hosts are identified by the sub-man ID, and we can assume they already
      # exist in the local inventory. This will also handle facet creation for new hosts.
      return if @host.insights

      insights_facet = @host.build_insights(uuid: @host.subscription_facet.uuid)
      insights_facet.save
    end
  end
end
