module ForemanInventoryUpload
  class AccountsController < ::ApplicationController
    def index
      organizations = User.current.my_organizations
      labels = organizations.pluck(:id, :name)

      accounts = Hash[
        labels.map do |id, label|
          generate_task = latest_task_for(id, ForemanInventoryUpload::Async::HostInventoryReportJob)

          # Check sub-action completion status
          generated_status = sub_action_status(generate_task, 'GenerateHostReport')
          uploaded_status = sub_action_status(generate_task, 'UploadReportDirectJob')

          report_file_paths = ForemanInventoryUpload.report_file_paths(id)

          [
            label,
            {
              generated_status: generated_status,
              uploaded_status: uploaded_status,
              generate_task: task_json(generate_task),
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

    def controller_permission
      'foreman_rh_cloud'
    end

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

    def sub_action_status(task, action_class_name)
      return nil unless task

      # If task is still running, return the state
      return task.state unless task.state == 'stopped'

      # For GenerateHostReport: always show status if task completed (generation always runs)
      if action_class_name == 'GenerateHostReport'
        return task.result
      end

      # For UploadReportDirectJob: only show status if task had upload enabled
      if action_class_name == 'UploadReportDirectJob'
        main_action = task.main_action
        return nil unless main_action.respond_to?(:input)

        # Check if upload was enabled for this task
        return nil unless main_action.input[:upload]

        # Return the task result
        return task.result
      end

      nil
    rescue StandardError => e
      Rails.logger.warn("Failed to get sub-action status for #{action_class_name} in task #{task.id}: #{e.message}")
      nil
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
        duration: task.try(:duration)&.to_f,
        report_file_path: task_report_file_path(task),
      }
    end

    def task_report_file_path(task)
      return nil unless task&.state == 'stopped'

      # Get the main action from the task
      main_action = task.main_action
      return nil unless main_action.respond_to?(:report_file_path)

      main_action.report_file_path
    rescue StandardError => e
      Rails.logger.warn("Failed to get report file path for task #{task.id}: #{e.message}")
      nil
    end
  end
end
