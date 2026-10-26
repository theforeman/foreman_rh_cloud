module InsightsCloud
  class HitsController < ::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanRhCloud::CertAuth

    def index
      hits = resource_base_search_and_page.preload(:host, :rule)

      render json: {
        hits: hits.map { |hit| hit.attributes.merge(hostname: hit.host&.name, has_playbook: hit.has_playbook?, host_uuid: hit.host_uuid) },
        itemCount: hits.count,
      }, status: :ok
    end

    def show
      host = Host.authorized.find_by(id: host_id_param)
      unless host
        return render json: {
          error: 'No recommendations were found for this host',
        }, status: :not_found
      end

      hits = host_hits(host)

      render json: {
        hits: hits,
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

    def host_hits(host)
      hits = resource_base.where(host_id: host.id)
      return hits unless hits.empty?

      uuid = host.insights_uuid
      return [] if uuid.blank?

      cloud_hits(host, uuid)
    end

    def cloud_hits(host, uuid)
      cloud_response = execute_cloud_request(
        organization: host.organization,
        method: :get,
        url: "#{InsightsCloud.ui_base_url}/api/insights/v1/system/#{uuid}/reports"
      )
      payload = JSON.parse(cloud_response.to_s)
      entries = if payload.is_a?(Array)
                  payload
                else
                  payload['data'] || payload['reports'] || payload['hits'] || []
                end
      return [] unless entries.is_a?(Array)

      entries.filter_map do |entry|
        next unless entry.is_a?(Hash)

        total_risk = entry['total_risk'].to_i
        title =
          entry['title'] ||
          entry.dig('rule', 'description') ||
          entry.dig('rule', 'summary') ||
          entry['rule_id']

        {
          host_id: host.id,
          title: title,
          total_risk: total_risk.between?(1, 4) ? total_risk : 1,
          results_url: entry['results_url'] || entry['url'],
          solution_url: entry['solution_url'] || entry.dig('resolution', 'url'),
          rule_id: entry['rule_id'] || entry.dig('rule', 'rule_id'),
        }.compact
      end
    rescue StandardError => e
      logger.debug("Cloud fallback for host #{host.id} failed: #{e}")
      []
    end
  end
end
