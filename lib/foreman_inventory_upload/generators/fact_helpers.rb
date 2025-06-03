require 'json'

module ForemanInventoryUpload
  module Generators
    module FactHelpers
      extend ActiveSupport::Concern

      CLOUD_AMAZON = 'aws'
      CLOUD_GOOGLE = 'gcp'
      CLOUD_AZURE = 'azure'
      CLOUD_ALIBABA = 'alibaba'

      UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      def fact_value(host, fact_name)
        value_record = host.fact_values.find do |fact_value|
          fact_value.fact_name_id == ForemanInventoryUpload::Generators::Queries.fact_names[fact_name]
        end
        value_record&.value
      end

      def kilobytes_to_bytes(kilobytes)
        kilobytes * 1024
      end

      def account_id(organization)
        @organization_accounts ||= {}
        @organization_accounts[organization.id] ||= organization.pools.where.not(account_number: nil).pluck(:account_number).first
      end

      def golden_ticket?(organization)
        result = organization.try(:golden_ticket?)
        result = organization.content_access_mode == 'org_environment' if result.nil?

        @organization_golden_tickets ||= {}
        @organization_golden_tickets[organization.id] ||= result
      end

      def cloud_provider(host)
        bios_version = fact_value(host, 'dmi::bios::version')

        if bios_version
          return CLOUD_AMAZON if bios_version.downcase['amazon']
          return CLOUD_GOOGLE if bios_version.downcase['google']
        end

        chassis_asset_tag = fact_value(host, 'dmi::chassis::asset_tag')
        return CLOUD_AZURE if chassis_asset_tag && chassis_asset_tag['7783-7084-3265-9085-8269-3286-77']

        system_manufacturer = fact_value(host, 'dmi::system::manufacturer')
        return CLOUD_ALIBABA if system_manufacturer && system_manufacturer.downcase['alibaba cloud']

        product_name = fact_value(host, 'dmi::system::product_name')
        return CLOUD_ALIBABA if product_name && product_name.downcase['alibaba cloud ecs']

        nil
      end

      def obfuscate_hostname?(host)
        # Returns true if hostname obfuscation should be applied for a given host, based on hierarchy:
        # 1. Global setting for hostname obfuscation.
        return true if Setting[:obfuscate_inventory_hostnames]

        insights_client_setting = fact_value(host, 'insights_client::obfuscate_hostname_enabled')
        insights_client_setting = ActiveModel::Type::Boolean.new.cast(insights_client_setting)

        # 2. host fact reported by insights_client
        # 3. if neither of the above, don't obfuscate.
        insights_client_setting.nil? ? false : insights_client_setting
      end

      def fqdn(host)
        if obfuscate_hostname?(host)
          # If obfuscation is enabled, attempt to retrieve an already obfuscated hostname
          # from the 'insights_client::obfuscated_hostname' fact.
          # Example format of `parsed_insights_array`:
          # [{"original"=>"host.example.com", "obfuscated"=>"0dd449d0a027.example.com"},
          #  {"original"=>"satellite.example.com", "obfuscated"=>"host2.example.com"}]
          begin
            parsed_insights_array = JSON.parse(fact_value(host, 'insights_client::obfuscated_hostname') || '[]')
          rescue JSON::ParserError
            parsed_insights_array = []
          end
          # Obfuscate using the following hierarchy:
          # 1. the obfuscated_hostname fact sent by insights_client
          parsed_insights_item = parsed_insights_array.find { |item| item['original'] == host.fqdn }
          # 2. our own helper method
          parsed_insights_item&.[]('obfuscated') || obfuscate_fqdn(host.fqdn)
        else
          # If hostname obfuscation is not enabled for this host, return the host's original FQDN.
          host.fqdn
        end
      end

      def obfuscate_fqdn(fqdn)
        "#{Digest::SHA1.hexdigest(fqdn)}.example.com"
      end

      def obfuscate_ips?(host)
        # Returns true if IP obfuscation should be applied for a given host, based on hierarchy:
        # 1. Global setting for IP obfuscation.
        return true if Setting[:obfuscate_inventory_ips]

        insights_client_ipv4_setting = fact_value(host, 'insights_client::obfuscate_ipv4_enabled')
        insights_client_ipv6_setting = fact_value(host, 'insights_client::obfuscate_ipv6_enabled')

        cast_ipv4_setting = ActiveModel::Type::Boolean.new.cast(insights_client_ipv4_setting)
        cast_ipv6_setting = ActiveModel::Type::Boolean.new.cast(insights_client_ipv6_setting)

        # 2. The host's IPv4 or IPv6 obfuscation fact value is true
        # 3. If neither of the above, don't obfuscate.
        cast_ipv4_setting || cast_ipv6_setting || false
      end

      def host_ips(host)
        # Determines and returns the IP addresses associated with a host, applying obfuscation if enabled.

        # If IP obfuscation is enabled for the host return a representation of obfuscated IP addresses.
        return obfuscated_ips(host) if obfuscate_ips?(host)

        # If IP obfuscation is NOT needed, return a special kind of Hash.
        # where when you try to access a key in it
        # if the key doesn't exist, it simply returns the key itself.
        # This is useful because it means if you try to get an IP from this hash,
        # you'll just get the original IP back. It allows the calling code to
        # use the same interface whether obfuscation is applied or not.
        Hash.new { |h, k| k }
      end

      def obfuscated_ips(host)
        # Example format of `parsed_insights_array`:
        # [{"original": "192.168.1.10", "obfuscated": "10.230.230.1"},
        #  {"original": "192.168.1.11", "obfuscated": "10.230.230.2"}]
        begin
          parsed_insights_array = JSON.parse(fact_value(host, 'insights_client::obfuscated_ipv4') || '[]')
        rescue JSON::ParserError
          parsed_insights_array = []
        end

        # Create a new Hash to store the mapping from original IP addresses to their obfuscated versions.
        # where the 'original' IP is the key and the 'obfuscated' IP is the value.
        obfuscated_ips = Hash[
          parsed_insights_array.map { |ip_record| [ip_record['original'], ip_record['obfuscated']] }
        ]

        # Sets a default proc for the obfuscated_ips hash.
        # When a key is accessed that does not exist in the hash, this proc is called.
        # It assigns the result of obfuscate_ip(key, hash) to the missing key in the hash.
        # This ensures that any missing IP address key will be obfuscated and stored automatically.
        obfuscated_ips.default_proc = proc do |hash, key|
          hash[key] = obfuscate_ip(key, hash)
        end
        obfuscated_ips
      end

      def obfuscate_ip(ip, ips_dict)
        # Produce a new, unique obfuscated IP that is
        # numerically one greater than the highest existing obfuscated IP
        max_obfuscated = ips_dict.values.map { |v| IPAddr.new(v).to_i }.max || IPAddr.new('10.230.230.0').to_i

        IPAddr.new(max_obfuscated + 1, Socket::AF_INET).to_s
      end

      def hostname_match
        bash_hostname = `uname -n`.chomp
        foreman_hostname = ForemanRhCloud.foreman_host&.name
        if bash_hostname == foreman_hostname
          fqdn(ForemanRhCloud.foreman_host)
        elsif Setting[:obfuscate_inventory_hostnames]
          obfuscate_fqdn(bash_hostname)
        else
          bash_hostname
        end
      end

      def bios_uuid(host)
        value = fact_value(host, 'dmi::system::uuid') || ''
        uuid_value(value)
      end

      def uuid_value(value)
        uuid_match = UUID_REGEX.match(value)
        uuid_match&.to_s
      end

      def uuid_value!(value)
        uuid = uuid_value(value)
        raise Foreman::Exception.new(N_('Value %{value} is not a valid UUID') % { value: value }) if value && uuid.empty?

        uuid
      end
    end
  end
end
