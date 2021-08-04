module ForemanInventoryUpload
  class CloudStatusController < ::ApplicationController
    def index
      organizations = User.current.my_organizations

      ping_service = ForemanRhCloud::CloudPingService.new(organizations, logger)
      ping_result = ping_service.ping
      ping_result[:cert_auth] =  ping_result[:cert_auth].map do |org, status_hash|
        status_hash.merge(
          {
            org_id: org.id,
            org_name: org.name,
          }
        )
      end

      render json: {
        ping: ping_result,
      }, status: :ok
    end

    def logger
      Foreman::Logging.logger('app')
    end
  end
end
