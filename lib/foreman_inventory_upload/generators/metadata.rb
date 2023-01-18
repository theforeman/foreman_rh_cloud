module ForemanInventoryUpload
  module Generators
    class Metadata
      def initialize(output = [])
        @stream = JsonStream.new(output)
      end

      def add_slice(slice_id, hosts_count, first)
        @stream.comma unless first

        @stream.object_field(slice_id, :last) do
          @stream.simple_field('number_hosts', hosts_count, :last)
        end
      end

      def render(metadata = nil, &block)
        render_report(metadata, &block)
        @stream.out
      end

      private

      def render_report(metadata)
        metadata ||= {}
        metadata['foreman_rh_cloud_version'] = ForemanRhCloud::VERSION

        @stream.object do
          @stream.simple_field('report_id', Foreman.uuid)
          @stream.simple_field('host_inventory_api_version', '1.0')
          Setting[:obfuscate_inventory_hostnames] ? @stream.simple_field('source', 'Satellite') : @stream.simple_field('source', ForemanRhCloud.foreman_host_name)
          @stream.simple_field('IP address', ForemanRhCloud.foreman_host.facts['network::ipv4_address']) unless Setting[:obfuscate_inventory_ips]
          @stream.simple_field('bios UUID', ForemanRhCloud.foreman_host.facts['dmi::system::uuid'])
          @stream.simple_field('source_metadata', metadata)
          @stream.object_field('report_slices', :last) do
            yield(self)
          end
        end
      end
    end
  end
end
