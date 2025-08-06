module ForemanRhCloud
  module IopSmartProxyAccess
    extend ActiveSupport::Concern

    private

    def require_non_iop_smart_proxy
      return unless ForemanRhCloud.with_iop_smart_proxy?

      handle_iop_access_error('This feature is not available when using IoP Smart Proxy')
    end

    def require_iop_smart_proxy
      return if ForemanRhCloud.with_iop_smart_proxy?

      handle_iop_access_error('This feature is not available without IoP Smart Proxy')
    end

    def handle_iop_access_error(message)
      if api_request?
        not_found(message)
      else
        error(message)
        redirect_back(fallback_location: main_app.root_path)
      end
    end
  end
end
