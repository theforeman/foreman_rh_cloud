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
      return 'Satellite' if defined? ForemanThemeSatellite
      'Foreman'
    end

    def core_app_version
      return Foreman::Version.new(ForemanThemeSatellite::SATELLITE_VERSION) if defined? ForemanThemeSatellite
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
      labels = [new_label('Organization', host.organization.name, 'Satellite')]
      labels += labels_from_items(host.location.title.split('/'), 'Satellite', ->(item) { 'Location' }) if host.location
      labels += labels_from_items(host.hostgroup.title.split('/'), 'Satellite', ->(item) { 'Host Group' }) if host.hostgroup
      labels += labels_from_items(host.host_collections, 'Satellite', ->(item) { 'Host Collection' }, :name)

      if Setting[:include_parameter_tags]
        labels += labels_from_items(
          host.host_inherited_params_objects,
          'SatelliteParameter',
          ->(item) { item.name },
          :value)
      end

      labels
    end
  end
end
