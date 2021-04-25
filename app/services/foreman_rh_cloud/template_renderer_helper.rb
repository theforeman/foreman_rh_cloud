module ForemanRhCloud
  # Macro to fetch remediation playbook from cloud.redhat.com
  module TemplateRendererHelper
    extend ActiveSupport::Concern
    extend ApipieDSL::Module

    apipie :class, 'Macros related to Red Hat cloud interface' do
      name 'RHCloud'
      sections only: %w[all jobs]
    end

    apipie :method, 'Returns a playbook generated from Red Hat cloud recommendations' do
      required :hit_remediation_pairs, String, desc: 'JSON-encoded array of hashes in the form of [{hit_id: 1, remediation_id: 2}, ...]'
      returns String, desc: 'Playbook generated for the specific recommendations and hosts'
    end
    def remediations_playbook(hit_remediation_pairs)
      hit_remediation_pairs = JSON.parse(hit_remediation_pairs)
      retriever = ForemanRhCloud::RemediationsRetriever.new(hit_remediation_pairs, logger: template_logger)
      retriever.create_playbook
    end
  end
end
