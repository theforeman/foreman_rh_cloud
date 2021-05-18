module ForemanInventoryUpload
  module Generators
    class Tags
      def initialize(host)
        @host = host
      end

      def generate
        (
          locations +
          hostgroups +
          host_collections +
          organizations +
          content_data +
          satellite_server_data
        ).reject { |key, value| value.empty? }
      end

      def generate_parameters
        return [] unless Setting[:include_parameter_tags]

        (@host.host_inherited_params_objects || []).map { |item| [item.name, item.value] }
      end

      private

      def locations
        return [] unless @host.location
        @host.location.title.split('/').map { |item| ['location', item] }.push(['location', @host.location.title])
      end

      def hostgroups
        return [] unless @host.hostgroup
        @host.hostgroup.title.split('/').map { |item| ['hostgroup', item] }.push(['hostgroup', @host.hostgroup.title])
      end

      def host_collections
        (@host.host_collections || []).map { |item| ['host collection', item.name] }
      end

      def organizations
        [['organization', @host.organization.name]]
      end

      def content_data
        [
          ['lifecycle_environment', @host.lifecycle_environment&.name],
          ['content_view', @host.content_view&.name],
        ] +
        (@host.activation_keys || []).map { |item| ['activation_key', item.name] }
      end

      def satellite_server_data
        [
          ['satellite_instance_id', Foreman.instance_id],
          ['organization_id', @host.organization_id.to_s],
        ]
      end
    end
  end
end
