module Api::V2::RhCloud
  class CloudRequestController < ::Api::V2::BaseController
    layout false

    KNOWN_DIRECTIVES = {
      'playbook-sat' => :handle_run_playbook_request,
      'foreman_rh_cloud' => :handle_run_playbook_request,
    }

    def update
      handler = KNOWN_DIRECTIVES[directive]

      unless handler
        render json: {
          :message => "No valid handler is found for directive: #{directive}",
        }, status: :bad_request
        return
      end

      send(handler)

      render json: {
        :message => "Handled #{directive} by #{handler}",
      }
    end

    private

    def metadata
      params['Metadata'] || params['metadata']
    end

    def content
      content = params['Content'] || params['content']

      # the content received as base 64 of the string in double quotes
      Base64.decode64(content).tr('"', '')
    end

    def directive
      params['Directive'] || params['directive']
    end

    def handle_run_playbook_request
      logger.error("Playbook URL is not valid: #{content}") && return unless valid_url?(content)
      logger.error("Reporting URL is not valid: #{metadata['return_url']}") && return unless valid_url?(metadata['return_url'])

      hosts = metadata['hosts'].split(',')

      # select hosts from the metadata list that are not disabled by the parameter.
      host_ids = Host.search_for("not params.#{InsightsCloud.enable_cloud_remediations_param} = f")
                     .where(id: host_ids(hosts))
                     .pluck(:id)

      logger.warn("Some hosts were not found/ignored. Looked for: #{hosts}, found ids: #{host_ids}") unless host_ids.length == hosts.length

      logger.error("sat_org_id is not present in the metadata") && return unless metadata['sat_org_id']
      org_id = metadata['sat_org_id'].to_i
      organization = Organization.find(org_id)

      composer = nil
      Organization.as_org(organization) do
        composer = ::JobInvocationComposer.for_feature(
          :rh_cloud_connector_run_playbook,
          host_ids,
          {
            playbook_url: content,
            organization_id: org_id,
            report_url: metadata['return_url'],
            report_interval: metadata['response_interval'].to_i,
            correlation_id: metadata['correlation_id'],
          }
        )
        composer.trigger!
      end

      composer.job_invocation
    end

    def valid_url?(url)
      parsed = URI(url)
      ForemanRhCloud.cloud_url_validator.match(parsed.host)
    end

    def host_ids(hosts)
      InsightsFacet.where(uuid: hosts).pluck(:host_id)
    end
  end
end
