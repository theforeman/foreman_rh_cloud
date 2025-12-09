module ForemanRhCloud
  module RegistrationManagerExtensions
    include ForemanRhCloud::CertAuth

    def logger
      Rails.logger
    end

    def unregister_host(host, options = {})
      organization_destroy = options.fetch(:organization_destroy, false)

      # Reload to ensure we have fresh association data
      host.reload

      # Only delete from HBI in IoP mode (hosted mode uses async job for cleanup)
      hbi_host_destroy(host) if ForemanRhCloud.with_iop_smart_proxy? && !organization_destroy && host.insights_facet&.uuid&.presence
      host.insights&.destroy!
      super(host, options)
    end

    def hbi_host_destroy(host)
      uuid = host.insights_uuid
      logger.debug "Unregistering host #{uuid} from HBI"
      execute_cloud_request(
        organization: host.organization,
        method: :delete,
        url: ForemanInventoryUpload.host_by_id_url(uuid),
        headers: {
          content_type: :json,
        }
      )
    rescue RestClient::NotFound
      Rails.logger.warn(_("Attempted to destroy HBI host %s, but host does not exist in HBI") % uuid)
    rescue StandardError => e
      # TODO: Improve error handling - don't break registration if HBI delete fails
      Rails.logger.error(format(_("Failed to destroy HBI host %s: %s"), uuid, e.message))
    end
  end
end
