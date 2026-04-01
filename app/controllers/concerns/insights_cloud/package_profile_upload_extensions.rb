module InsightsCloud
  module PackageProfileUploadExtensions
    extend ActiveSupport::Concern

    included do
      # This method explicitly listens on Katello actions
      # rubocop:disable Rails/LexicallyScopedActionFilter
      after_action :generate_host_report, only: [:upload_package_profile, :upload_profiles]
      after_action :update_insights_client_status, only: [:upload_package_profile, :upload_profiles]
      # rubocop:enable Rails/LexicallyScopedActionFilter
    end

    def generate_host_report
      return unless ForemanRhCloud.with_iop_smart_proxy?

      logger.debug("Generating host-specific report for host #{@host.name}")

      ForemanTasks.async_task(
        ForemanInventoryUpload::Async::SingleHostReportJob,
        ForemanInventoryUpload.generated_reports_folder,
        @host.organization_id,
        @host.id
      )

      # Ensure insights UUID matches subscription UUID (only runs in IoP mode per method guard above)
      @host.ensure_iop_insights_uuid

      # in IoP case, the hosts are identified by the sub-man ID, and we can assume they already
      # exist in the local inventory. This will also handle facet creation for new hosts.
      return if @host.insights

      insights_facet = @host.build_insights(uuid: @host.subscription_facet.uuid)
      insights_facet.save
    end

    def update_insights_client_status
      # Update InsightsClientReportStatus whenever host checks in via subscription-manager
      # This ensures USER_OMITTED status gets set even when insights-client isn't installed
      # (parameter=false means insights-client won't be installed, so it won't hit MachineTelemetriesController)
      @host.get_status(InsightsClientReportStatus).refresh!
      @host.refresh_global_status!
    end
  end
end
