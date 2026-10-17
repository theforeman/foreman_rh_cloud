module ForemanInventoryUpload
  class Report < ApplicationRecord
    self.table_name = 'foreman_inventory_upload_reports'

    belongs_to :organization
    has_one_attached :archive if respond_to?(:has_one_attached)

    enum state: {
      generated: 0,
      uploading: 1,
      completed: 2,
      failed: 3,
      skipped: 4,
    }

    validates :filename, presence: true
    validates :sha256, presence: true

    scope :latest_first, -> { order(created_at: :desc, id: :desc) }

    def self.from_file!(path, **attributes)
      require 'digest'
      require 'base64'
      blob = nil
      transaction(requires_new: true) do
        File.open(path, 'rb') do |file|
          sha256 = Digest::SHA256.file(file.path).hexdigest
          blob = ActiveStorage::Blob.create_before_direct_upload!(
            filename: File.basename(path), content_type: 'application/x-xz',
            byte_size: file.size, checksum: Base64.strict_encode64(Digest::MD5.file(file.path).digest)
          )
          blob.upload(file, identify: false)
          blob.open do |copy|
            raise ActiveStorage::IntegrityError unless copy.size == file.size && Digest::SHA256.file(copy.path).hexdigest == sha256
          end
          blob.save!
          create!(**attributes, filename: File.basename(path), sha256: sha256, archive: blob)
        end
      end
    rescue StandardError
      if blob && !blob.attachments.exists?
        blob.service.delete(blob.key)
        blob.destroy! if blob.persisted?
      end
      raise
    end

    # Retain the latest file per organization/filter and every resumable task.
    # Imported files remain protected until explicit legacy cleanup succeeds.
    def self.prune_completed!(organization_id, filename)
      reports = where(organization_id: organization_id, filename: filename).latest_first
      latest_id = reports.limit(1).pick(:id)
      reports.where.not(id: latest_id).find_each do |report|
        next if report.legacy_path && !report.legacy_cleaned_at
        stopped = report.execution_plan_uuid.present? && ForemanTasks::Task.where(external_id: report.execution_plan_uuid, state: 'stopped').exists?
        next unless report.legacy_cleaned_at || stopped

        report.destroy!
      end
    end
  end
end
