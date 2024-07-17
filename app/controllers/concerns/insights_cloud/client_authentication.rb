module InsightsCloud
  module ClientAuthentication
    extend ActiveSupport::Concern

    include ::Katello::Authentication::ClientAuthentication

    def authorize
      client_authorized? || super
    end

    def client_authorized?
      authenticate_client && valid_machine_user?
    end

    def valid_machine_user?
      subscribed_host_by_uuid(User.current.uuid).present?
    end

    def subscribed_host_by_uuid(uuid)
      @host = Host.unscoped.joins(:subscription_facet).where(:katello_subscription_facets => { :uuid => uuid }).first
    end
  end
end
