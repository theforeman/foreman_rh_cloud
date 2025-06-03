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
        # Returns true if hostname obfuscation should be applied for a given host.
        # This method determines whether the hostname associated with a host
        # should be hidden or masked based on global settings and host-specific facts.

        # Check the global setting for hostname obfuscation.
        # If 'obfuscate_inventory_hostnames' is set to true in the application settings,
        # then hostname obfuscation is always enabled, regardless of host-specific settings.
        return true if Setting[:obfuscate_inventory_hostnames]

        # Retrieve the host-specific fact related to hostname obfuscation from 'insights_client'.
        # This fact indicates whether hostname obfuscation is enabled for this particular host.
        insights_client_setting = fact_value(host, 'insights_client::obfuscate_hostname_enabled')

        # Cast the retrieved setting to a boolean value.
        # This ensures that the value from the fact (which might be a string or other type)
        # is correctly interpreted as true or false.
        insights_client_setting = ActiveModel::Type::Boolean.new.cast(insights_client_setting)

        # If the host-specific setting is not nil (meaning it was explicitly set to true or false),
        # return its boolean value directly. This prioritizes the host-specific setting
        # over the global default if the host has a specific configuration.
        return insights_client_setting if !insights_client_setting.nil?

        # If the host-specific setting was nil (meaning it wasn't explicitly set for this host),
        # fall back to the global 'obfuscate_inventory_hostnames' setting.
        # This serves as the default behavior when no specific host configuration is found.
        Setting[:obfuscate_inventory_hostnames]
      end

      def fqdn(host)
        # Returns the Fully Qualified Domain Name (FQDN) for a given host,
        # potentially obfuscating it if hostname obfuscation is enabled.
        # Check if hostname obfuscation is enabled for this host using the `obfuscate_hostname?` method.
        if obfuscate_hostname?(host)
          # If obfuscation is enabled, attempt to retrieve an already obfuscated hostname
          # from the 'insights_client::obfuscated_hostname' fact.
          # This fact is expected to contain a JSON array of mappings between original and obfuscated hostnames.

          # Parse the 'insights_client::obfuscated_hostname' fact value as a JSON array.
          # If the fact is not present or empty, default to an empty array to prevent parsing errors.
          # Example format of `parsed_insights_array`:
          # [{"original"=>"host.example.com", "obfuscated"=>"0dd449d0a027.example.com"},
          #  {"original"=>"satellite.example.com", "obfuscated"=>"host2.example.com"}]
          parsed_insights_array = JSON.parse(fact_value(host, 'insights_client::obfuscated_hostname') || '[]')

          # Find the specific item in the parsed array where the 'original' hostname matches
          # the host's actual FQDN.
          parsed_insights_item = parsed_insights_array.find { |item| item['original'] == host.fqdn }

          # Return the 'obfuscated' value from the found item if it exists.
          # The `&.` (safe navigation operator) prevents an error if `parsed_insights_item` is nil.
          # If no matching obfuscated hostname is found in the fact, or if the fact itself was empty,
          # then dynamically obfuscate the host's FQDN using the `obfuscate_fqdn` helper method.
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
        # Returns true if IP obfuscation should be applied for a given host.
        # This method determines whether IP addresses associated with a host
        # should be hidden or masked based on global settings and host-specific facts.

        # Check the global setting for IP obfuscation.
        # If 'obfuscate_inventory_ips' is set to true in the application settings,
        # then IP obfuscation is always enabled, regardless of host-specific settings.
        return true if Setting[:obfuscate_inventory_ips]

        # Retrieve host-specific facts related to IP obfuscation from 'insights_client'.
        # These facts indicate whether IPv4 and IPv6 obfuscation are enabled for this particular host.
        insights_client_ipv4_setting = fact_value(host, 'insights_client::obfuscate_ipv4_enabled')
        insights_client_ipv6_setting = fact_value(host, 'insights_client::obfuscate_ipv6_enabled')

        # Cast the retrieved settings to boolean values.
        # This ensures that the values from the facts (which might be strings or other types)
        # are correctly interpreted as true or false.
        casted_ipv4_setting = ActiveModel::Type::Boolean.new.cast(insights_client_ipv4_setting)
        casted_ipv6_setting = ActiveModel::Type::Boolean.new.cast(insights_client_ipv6_setting)

        # Determine the final obfuscation decision.
        # IP obfuscation is enabled if:
        # - The host's IPv4 obfuscation setting is true OR
        # - The host's IPv6 obfuscation setting is true OR
        # - The global 'obfuscate_inventory_ips' setting is true (this condition was already checked above,
        #   but it's good to keep it for logical completeness if the initial return guard wasn't there).
        casted_ipv4_setting || casted_ipv6_setting || Setting[:obfuscate_inventory_ips]
      end

      def host_ips(host)
        # Determines and returns the IP addresses associated with a host,
        # applying obfuscation if enabled.

        # If IP obfuscation is enabled for the host (checked via `obfuscate_ips?`),
        # return a representation of obfuscated IP addresses.
        # The `obfuscated_ips` method (not shown here) would handle the actual
        # obfuscation logic and likely return a structure that maps original IPs
        # to their obfuscated counterparts.
        return obfuscated_ips(host) if obfuscate_ips?(host)

        # If IP obfuscation is NOT needed, return a special kind of Hash.
        # This Hash acts as a "pass-through proxy." When you try to access a key in it,
        # if the key doesn't exist, it simply returns the key itself.
        # This is useful because it means if you try to get an IP from this hash,
        # and that IP isn't explicitly defined as something to be obfuscated,
        # you'll just get the original IP back. It allows the calling code to
        # use the same interface whether obfuscation is applied or not.
        Hash.new { |h, k| k }
      end

      def obfuscated_ips(host)
        # Retrieves and provides a mechanism to access obfuscated IP addresses for a given host.
        # This method primarily uses pre-obfuscated IPs from host facts, but can also
        # dynamically obfuscate new IPs if they are not already present in the facts.

        # Parse the 'insights_client::obfuscated_ipv4' fact value as a JSON array.
        # This fact is expected to contain a list of hashes, where each hash maps
        # an 'original' IP to its 'obfuscated' counterpart.
        # If the fact is not present or empty, default to an empty JSON array to prevent parsing errors.
        # Example format of `insights_client_ips`:
        # [{"original": "192.168.1.10", "obfuscated": "10.230.230.1"},
        #  {"original": "192.168.1.11", "obfuscated": "10.230.230.2"}]
        insights_client_ips = JSON.parse(fact_value(host, 'insights_client::obfuscated_ipv4') || '[]')

        # Create a new Hash to store the mapping from original IP addresses to their obfuscated versions.
        # The `map` function transforms each `ip_record` into a key-value pair,
        # where the 'original' IP is the key and the 'obfuscated' IP is the value.
        obfuscated_ips = Hash[
          insights_client_ips.map { |ip_record| [ip_record['original'], ip_record['obfuscated']] }
        ]

        # Set a `default_proc` for the `obfuscated_ips` hash.
        # This `default_proc` defines what happens when you try to access a key (an original IP)
        # that does not yet exist in the `obfuscated_ips` hash.
        # When an unknown key `k` is accessed:
        # 1. `obfuscate_ip(key, hash)` is called to generate a new, unique obfuscated IP for `key`.
        #    The `hash` itself is passed to `obfuscate_ip` so it can consider existing obfuscated IPs
        #    when generating a new one (e.g., to ensure uniqueness and sequential assignment).
        # 2. The newly generated obfuscated IP is then stored in the `obfuscated_ips` hash with `key`.
        # 3. The newly generated obfuscated IP is returned.
        # This ensures that any IP requested through this hash will either retrieve a pre-existing
        # obfuscated value or generate a new one on the fly and store it for future access.
        obfuscated_ips.default_proc = proc do |hash, key|
          hash[key] = obfuscate_ip(key, hash)
        end

        # Return the `obfuscated_ips` hash, which now serves as the primary interface
        # for retrieving obfuscated IP addresses for the given host.
        obfuscated_ips
      end

      def obfuscate_ip(ip, ips_dict)
        # Generates an obfuscated IP address based on existing obfuscated IPs.
        # This method aims to produce a new, unique obfuscated IP that is
        # numerically one greater than the highest existing obfuscated IP,
        # ensuring a sequential and non-conflicting assignment within a specific range.

        # Determine the maximum integer value among all currently obfuscated IP addresses
        # found in `ips_dict`. `ips_dict` is expected to be a hash where values are
        # already obfuscated IP strings.
        # We convert each obfuscated IP string to an integer for numerical comparison.
        # If `ips_dict` is empty or contains no valid IP addresses,
        # it defaults to the integer representation of '10.230.230.0'.
        # This default provides a starting point for obfuscated IPs if none exist yet.
        max_obfuscated = ips_dict.values.map { |v| IPAddr.new(v).to_i }.max || IPAddr.new('10.230.230.0').to_i

        # Generate the new obfuscated IP address.
        # We increment the `max_obfuscated` integer by 1 to ensure the new IP is unique
        # and sequential.
        # Then, we convert this integer back into an IPv4 address string.
        # `Socket::AF_INET` specifies that we are dealing with an IPv4 address.
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
