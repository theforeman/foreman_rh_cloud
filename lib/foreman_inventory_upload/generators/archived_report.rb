module ForemanInventoryUpload
  module Generators
    class ArchivedReport
      def initialize(target, logger = Rails.logger)
        @target = target
        @logger = logger
      end

      def render(organization:)
        Dir.mktmpdir do |tmpdir|
          @logger.info "Started generating hosts report in #{tmpdir}"
          host_batches = ForemanInventoryUpload::Generators::Queries.for_org(organization)
          File.open(File.join(tmpdir, 'metadata.json'), 'w') do |metadata_out|
            metadata_generator = ForemanInventoryUpload::Generators::Metadata.new(metadata_out)
            metadata_generator.render do |inner_generator|
              first = true
              host_batches.each do |hosts_batch|
                slice_id = Foreman.uuid
                @logger.info "Adding slice #{slice_id}"
                hosts_count = generate_slice(tmpdir, slice_id, hosts_batch)
                @logger.info "slice #{slice_id} was created with #{hosts_count} hosts"
                inner_generator.add_slice(slice_id, hosts_count, first)
                first = false
              end
            end
          end
          @logger.info 'Report generation finished'

          @logger.info 'Archiving generated report'
          # success = system('tar', '-zcvf', @target, '-C', tmpdir, '.')
          Open3.popen2e('tar', '-zcvf', @target, '-C', tmpdir, '.') do |_in, out, wait_thr|
            @logger.info("tar: #{out.read}")

            if wait_thr.value.success?
              @logger.info 'Report archived successfully'
            else
              @logger.info "Tar command failed: #{$CHILD_STATUS}"
            end
          end
        end
      end

      private

      def generate_slice(tmpdir, slice_id, hosts_batch)
        hosts_count = 0
        File.open(File.join(tmpdir, "#{slice_id}.json"), 'w') do |slice_out|
          slice_generator = ForemanInventoryUpload::Generators::Slice.new(hosts_batch, slice_out, slice_id)
          slice_generator.render
          hosts_count = slice_generator.hosts_count
        end
        hosts_count
      end
    end
  end
end
