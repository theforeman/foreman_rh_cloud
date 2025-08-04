module ForemanRhCloud
  module IopSmartProxyAccess
    extend ActiveSupport::Concern

    private

    def require_no_iop_smart_proxy
      return unless ForemanRhCloud.with_iop_smart_proxy?

      render json: { error: 'Not available when using IoP Smart Proxy' }, status: :not_found
    end

    def require_iop_smart_proxy
      return if ForemanRhCloud.with_iop_smart_proxy?

      render json: { error: 'Not available without IoP Smart Proxy' }, status: :not_found
    end
  end
end
