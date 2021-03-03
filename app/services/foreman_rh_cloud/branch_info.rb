module ForemanRhCloud
  class BranchInfo
    def generate(uuid, host, branch_id, request_hostname)
      {
        :remote_leaf => uuid,
        :remote_branch => branch_id,
        :display_name => host.organization.name,
        :hostname => request_hostname,
        :product => {
          :type => core_app_name,
          :major_version => core_app_version.major,
          :minor_version => core_app_version.minor,
        },
        :organization_id => host.organization.id,
        :satellite_instance_id => Foreman.instance_id,
        :labels => host_labels(host),
      }
    end

    def core_app_name
      'Foreman'
    end

    def core_app_version
      Foreman::Version.new
    end

    def new_label(key, value, namespace)
      {
        :namespace => namespace,
        :key => key,
        :value => value,
      }
    end

    def labels_from_items(items, label_namespace, label_lamb, label_value_method = :to_s)
      items.map { |item| new_label(label_lamb.call(item), item.public_send(label_value_method), label_namespace) }
    end

    def host_labels(host)
      tags_generator = ForemanInventoryUpload::Generators::Tags.new(host)
      tags_generator.generate.map { |key, value| new_label(key, value, ForemanInventoryUpload::Generators::Slice::SATELLITE_NAMESPACE) } +
        tags_generator.generate_parameters.map { |key, value| new_label(key, value, ForemanInventoryUpload::Generators::Slice::SATELLITE_PARAMS_NAMESPACE) }
    end
  end
end
