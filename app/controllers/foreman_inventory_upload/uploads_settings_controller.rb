module ForemanInventoryUpload
  class UploadsSettingsController < ::ApplicationController
    def index
      render json: {
        autoUploadEnabled: Setting[:allow_auto_inventory_upload],
        hostObfuscationEnabled: Setting[:obfuscate_inventory_hostnames],
        ipsObfuscationEnabled: Setting[:obfuscate_inventory_ips],
        excludePackagesEnabled: Setting[:exclude_installed_packages],
        CloudConnectorStatus: ForemanInventoryUpload::UploadsSettingsController.cloud_connector_status,
        cloudToken: !Setting[:rh_cloud_token].empty?,
        lastSyncTask: last_successful_inventory_sync_task,
      }, status: :ok
    end

    def set_advanced_setting
      Setting[params.require(:setting)] = ActiveModel::Type::Boolean.new.cast(params.require(:value))
      index
    end

    def self.cloud_connector_status
      cloud_connector = ForemanRhCloud::CloudConnector.new
      job = cloud_connector&.latest_job
      return nil unless job
      { id: job.id, task: ForemanTasks::Task.where(:id => job.task_id).first }
    end

    def last_successful_inventory_sync_task
      task = ForemanTasks::Task.where(label: 'InventorySync::Async::InventoryFullSync', result: 'success')
                        .reorder('ended_at desc').first
      return nil unless task
      { output: task.output, endedAt: task.ended_at }
    end
  end
end
