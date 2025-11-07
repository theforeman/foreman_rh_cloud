module ForemanInventoryUpload
  module Api
    class TasksController < ::Api::V2::BaseController
      # GET /foreman_inventory_upload/api/tasks/current
      # Returns current running/active tasks for inventory operations
      def current
        organization_id = params[:organization_id]
        action_types = [
          'ForemanInventoryUpload::Async::HostInventoryReportJob',
          'ForemanInventoryUpload::Async::UploadReportDirectJob',
        ]

        tasks = ForemanTasks::Task
                .active
                .for_action_types(action_types)
                .with_duration

        if organization_id.present?
          tasks = tasks.joins(:links)
                       .where(foreman_tasks_links: {
                         resource_type: 'Organization',
              resource_id: organization_id,
                       })
        end

        render json: {
          tasks: tasks.map { |task| task_json(task) },
        }
      end

      # GET /foreman_inventory_upload/api/tasks/history
      # Returns recent task history for inventory operations
      def history
        organization_id = params[:organization_id]
        limit = params[:limit]&.to_i || 10
        action_types = [
          'ForemanInventoryUpload::Async::HostInventoryReportJob',
          'ForemanInventoryUpload::Async::UploadReportDirectJob',
        ]

        tasks = ForemanTasks::Task
                .for_action_types(action_types)
                .with_duration
                .order('started_at DESC')
                .limit(limit)

        if organization_id.present?
          tasks = tasks.joins(:links)
                       .where(foreman_tasks_links: {
                         resource_type: 'Organization',
              resource_id: organization_id,
                       })
        end

        render json: {
          tasks: tasks.map { |task| task_json(task) },
        }
      end

      private

      def task_json(task)
        {
          id: task.id,
          label: task.label,
          action: task.action,
          state: task.state,
          result: task.result,
          progress: task.progress,
          started_at: task.started_at,
          ended_at: task.ended_at,
          duration: task.try(:duration)&.to_f,
          humanized: task.humanized,
          report_file_path: task_report_file_path(task),
        }
      end

      def task_report_file_path(task)
        return nil unless task&.state == 'stopped'

        main_action = task.main_action
        return nil unless main_action.respond_to?(:report_file_path)

        main_action.report_file_path
      rescue StandardError => e
        Rails.logger.warn("Failed to get report file path for task #{task.id}: #{e.message}")
        nil
      end
    end
  end
end
