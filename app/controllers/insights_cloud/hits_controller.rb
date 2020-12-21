module InsightsCloud
  class HitsController < ::ApplicationController
    include Foreman::Controller::AutoCompleteSearch

    def index
      hits = resource_base_search_and_page

      render json: {
        hits: hits,
      }, status: :ok
    end

    def show
      host = Host.where(id: host_id_param).first

      render json: {
        hits: host.insights.hits,
      }, status: :ok
    end

    def model_of_controller
      ::InsightsHit
    end

    private

    def host_id_param
      params.require(:host_id)
    end
  end
end
