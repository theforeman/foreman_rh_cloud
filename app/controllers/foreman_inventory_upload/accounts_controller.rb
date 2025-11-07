module ForemanInventoryUpload
  class AccountsController < ::ApplicationController
    def index
      organizations = User.current.my_organizations
      labels = organizations.pluck(:id, :name)

      accounts = Hash[
        labels.map do |id, label|
          generate_task = latest_task_for(id, ForemanInventoryUpload::Async::HostInventoryReportJob)
          upload_task = latest_task_for(id, ForemanInventoryUpload::Async::UploadReportDirectJob)

          # Backward compatibility: provide status strings
          generate_report_status = task_status_string(generate_task)
          upload_report_status = task_status_string(upload_task)

          report_file_paths = ForemanInventoryUpload.report_file_paths(id)

          [
            label,
            {
              generate_report_status: generate_report_status,
              upload_report_status: upload_report_status,
              generate_task: task_json(generate_task),
              upload_task: task_json(upload_task),
              report_file_paths: report_file_paths,
              id: id,
            },
          ]
        end
      ]

      render json: {
        accounts: accounts,
        CloudConnectorStatus: ForemanInventoryUpload::UploadsSettingsController.cloud_connector_status,
      }, status: :ok
    end

    private

    def latest_task_for(org_id, job_class)
      ForemanTasks::Task
        .for_action_types([job_class.name])
        .joins(:links)
        .where(foreman_tasks_links: {
          resource_type: 'Organization',
          resource_id: org_id,
        })
        .with_duration
        .order('started_at DESC')
        .first
    end

    def task_status_string(task)
      return nil unless task

      if task.state == 'stopped'
        # Mimic old ProgressOutput format: "pid 12345 exit 0"
        exit_code = task.result == 'success' ? 0 : 1
        "pid #{Process.pid} exit #{exit_code}"
      else
        task.state
      end
    end

    def task_json(task)
      return nil unless task

      {
        id: task.id,
        label: task.label,
        state: task.state,
        result: task.result,
        progress: task.progress,
        started_at: task.started_at,
        ended_at: task.ended_at,
        duration: task.try(:duration),
      }
    end
  end
end
