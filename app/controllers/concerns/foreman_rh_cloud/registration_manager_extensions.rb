module ForemanRhCloud
  module RegistrationManagerExtensions
    include ForemanRhCloud::CertAuth

    def logger
      Rails.logger
    end

    def unregister_host(host, options = {})
    organization_destroy = options.fetch(:organization_destroy, false)
    
    hbi_host_destroy(host) if !organization_destroy && host.insights_facet.try(:uuid)
    host.insights_facet&.destroy!
    super(host, options)
  end
  
  def hbi_host_destroy(host)
    uuid = host.insights_facet.uuid
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
    end
  end
end