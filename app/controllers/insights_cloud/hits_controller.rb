module InsightsCloud
  class HitsController < ::ApplicationController
    def index
      host = Host.where(id: host_id_param).first

      render json: {
        hits: host.insights.hits,
      }, status: :ok
    end

    private

    def host_id_param
      params.require(:host_id)
    end
  end
end
