module InsightsCloud
  module CandlepinProxiesExtensions
    extend ActiveSupport::Concern

    included do
      # Update insights client status when hosts check in via subscription-manager facts upload
      # rubocop:disable Rails/LexicallyScopedActionFilter
      after_action :update_insights_client_status, only: [:facts]
      # rubocop:enable Rails/LexicallyScopedActionFilter
    end

    def update_insights_client_status
      # Update InsightsClientReportStatus whenever host checks in via subscription-manager
      # This ensures USER_OMITTED status gets set even when insights-client isn't installed
      # (parameter=false means insights-client won't be installed, so it won't hit MachineTelemetriesController)
      hoststatus = @host.get_status(InsightsClientReportStatus)
      Rails.logger.debug "Current status: #{hoststatus.to_label}"
      @host.get_status(InsightsClientReportStatus).refresh!
      @host.refresh_global_status!
      Rails.logger.debug "New status: #{hoststatus.to_label}"
    end
  end
end
