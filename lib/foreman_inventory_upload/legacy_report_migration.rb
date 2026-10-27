require 'digest'

module ForemanInventoryUpload
  class LegacyReportMigration
    FOLDERS = { 'generated_reports' => :generated, 'uploads' => :uploading, 'uploads/done' => :completed }.freeze

    def initialize(apply: false, cleanup: false, drained: false, output: $stdout)
      @apply = apply
      @cleanup = cleanup
      @drained = drained
      @output = output
    end

    def run
      raise 'Foreman Active Storage support is required' unless ForemanInventoryUpload.active_storage?
      LegacyArchiveLock.synchronize(shared: !@cleanup) { process_sources }
    end

    private

    def process_sources
      raise 'Symlinked legacy report root is not supported' if File.symlink?(ForemanInventoryUpload.base_folder)
      if @apply && @cleanup
        raise 'Stop legacy writers and pass CONFIRM_DRAINED=true' unless @drained
        if ForemanTasks::Task.where('label LIKE ?', 'ForemanInventoryUpload::Async::%').where.not(state: 'stopped').exists?
          raise 'Inventory tasks are still active or resumable; original files were retained'
        end
      end
      counts = { eligible: 0, copied: 0, cleaned: 0, skipped: 0, failed: 0 }
      FOLDERS.each do |folder, state|
        directory = File.join(ForemanInventoryUpload.base_folder, folder)
        next unless File.directory?(directory)
        raise 'Symlinked legacy report directory is not supported' if File.symlink?(directory)

        Dir.each_child(directory) do |name|
          next unless name.end_with?('.tar.xz')

          process(File.join(directory, name), state, counts)
        end
      end
      reconcile_missing_sources(counts) if @cleanup
      @output.puts("#{@apply ? 'Apply' : 'Preview'} #{@cleanup ? 'cleanup' : 'copy'}: #{counts.inspect}")
      counts
    end

    def reconcile_missing_sources(counts)
      Report.where.not(legacy_path: nil).where(legacy_cleaned_at: nil).find_each do |report|
        next if File.exist?(report.legacy_path) || File.symlink?(report.legacy_path)

        begin
          report.archive.open { |file| raise 'Stored archive differs' unless Digest::SHA256.file(file.path).hexdigest == report.sha256 }
          if @apply
            report.update!(legacy_cleaned_at: Time.current)
            counts[:cleaned] += 1
          else
            counts[:eligible] += 1
          end
        rescue StandardError => e
          counts[:failed] += 1
          @output.puts("Failed imported report #{report.id}: #{e.class}")
        end
      end
    end

    def process(path, state, counts)
      uploaded_blob = nil
      match = %r{\Areport_for_(\d+)(?:\[[^\]/]+\])?\.tar\.xz\z}.match(File.basename(path))
      raise 'Unrecognized report filename' unless match
      raise 'Organization no longer exists' unless Organization.unscoped.exists?(match[1])
      raise 'Only regular, non-symlink files can be migrated' unless File.file?(path) && !File.symlink?(path)

      before = fingerprint(path)
      sha256 = Digest::SHA256.file(path).hexdigest
      report = Report.find_by(legacy_path: path, sha256: sha256)
      if @cleanup
        raise 'No verified imported report for this source' unless report&.archive&.attached?

        report.archive.open { |file| raise 'Stored archive differs' unless Digest::SHA256.file(file.path).hexdigest == sha256 }
        raise 'Source changed while verifying' unless fingerprint(path) == before

        if @apply
          File.unlink(path)
          report.update!(legacy_cleaned_at: Time.current)
          counts[:cleaned] += 1
        else
          counts[:eligible] += 1
        end
      elsif report
        raise 'Imported archive is missing' unless report.archive.attached?
        report.archive.open { |file| raise 'Stored archive differs' unless Digest::SHA256.file(file.path).hexdigest == sha256 }

        counts[:skipped] += 1
      elsif @apply
        Report.transaction(requires_new: true) do
          report = Report.from_file!(path, organization_id: match[1], state: state, legacy_path: path, created_at: File.mtime(path))
          uploaded_blob = report.archive.blob
          raise 'Source changed while copying' unless fingerprint(path) == before && report.sha256 == sha256
        end
        counts[:copied] += 1
      else
        counts[:eligible] += 1
      end
    rescue StandardError => e
      # A source-change rollback must remove the just-uploaded external object.
      if uploaded_blob && !uploaded_blob.attachments.exists?
        uploaded_blob.service.delete(uploaded_blob.key)
      end
      counts[:failed] += 1
      @output.puts("Failed #{File.basename(path)}: #{e.class}: #{e.message}")
    end

    def fingerprint(path)
      stat = File.lstat(path)
      [stat.dev, stat.ino, stat.size, stat.mtime, stat.ctime]
    end
  end
end
