module ForemanInventoryUpload
  module Generators
    class Metadata
      include FactHelpers
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
          @stream.simple_field('source', 'Satellite')
          @stream.simple_field('reporting_host_name', hostname_match)
          @stream.simple_field('reporting_host_ips', host_ips(ForemanRhCloud.foreman_host))
          @stream.simple_field('reporting_host_bios_uuid', bios_uuid(ForemanRhCloud.foreman_host))
          @stream.simple_field('source_metadata', metadata)
          @stream.object_field('report_slices', :last) do
            yield(self)
          end
        end
      end
    end
  end
end
