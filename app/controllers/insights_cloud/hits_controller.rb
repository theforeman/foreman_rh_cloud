module InsightsCloud
  class HitsController < ::ApplicationController
    include Foreman::Controller::AutoCompleteSearch

    def index
      hits = resource_base_search_and_page.preload(:host, :rule)

      render json: {
        hasToken: !Setting[:rh_cloud_token].empty?,
        hits: hits.map { |hit| hit.attributes.merge(hostname: hit.host&.name, has_playbook: hit.has_playbook?, host_uuid: hit.host_uuid) },
        itemCount: hits.count,
      }, status: :ok
    end

    def show
      host = Host.where(id: host_id_param).first

      render json: {
        hits: host.insights.hits,
      }, status: :ok
    end

    def resolutions
      if remediation_all_selected_param
        hits = resource_base.with_playbook.search_for(params[:query])
      else
        hits = resource_base_search_and_page.with_playbook.where(id: remediation_ids_param)
      end

      hits.preload(:host, rule: :resolutions)

      render json: {
        hits: hits.map { |hit| hit.attributes.merge(hostname: hit.host&.name, resolutions: hit.rule.resolutions.map(&:attributes), reboot: hit.rule.reboot_required) },
        itemCount: hits.count,
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

    def action_permission
      case params[:action]
      when 'resolutions'
        'view'
      else
        super
      end
    end

    private

    def host_id_param
      params.require(:host_id)
    end

    def remediation_request_params
      params.permit(remediations: [:hit_id, :remediation_id]).require(:remediations)
    end

    def remediation_ids_param
      params.require(:ids).map(&:to_i)
    end

    def remediation_all_selected_param
      ActiveModel::Type::Boolean.new.cast(params[:isAllSelected])
    end

    def resource_base
      super.where(host: Host.authorized)
    end
  end
end
