module InsightsCloud
  class HitsController < ::ApplicationController
    include Foreman::Controller::AutoCompleteSearch

    def index
      hits = resource_base_search_and_page.where(host: Host.authorized).preload(:host, :rule)

      render json: {
        hasToken: !Setting[:rh_cloud_token].empty?,
        hits: hits.map { |hit| hit.attributes.merge(hostname: hit.host&.name, has_playbook: hit.has_playbook?) },
        itemCount: hits.count,
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

    def resource_class
      ::InsightsHit
    end

    def controller_permission
      :insights_hits
    end

    private

    def host_id_param
      params.require(:host_id)
    end

    def remediation_request_params
      params.permit(remediations: [:hit_id, :remediation_id]).require(:remediations)
    end
  end
end
