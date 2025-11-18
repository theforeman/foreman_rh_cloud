module ForemanInventoryUpload
  module Api
    class TasksController < ::Api::V2::BaseController
      # GET /foreman_inventory_upload/api/tasks/current
      # Returns current running/active tasks for inventory operations
      def current
        organization_id = validate_organization_id if params[:organization_id].present?
        return if performed?

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
        organization_id = validate_organization_id if params[:organization_id].present?
        return if performed?

        limit = validated_limit
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
        return nil unless task.state == 'stopped' && task.result == 'success'
        return nil unless task.action == 'ForemanInventoryUpload::Async::HostInventoryReportJob'

        task.main_action&.output&.[]('report_file')
      end

      def validate_organization_id
        org_id = params[:organization_id].to_i
        if org_id.zero?
          render json: { message: 'Invalid organization_id parameter' }, status: :bad_request
          return nil
        end

        begin
          Organization.find(org_id).id
        rescue ActiveRecord::RecordNotFound
          render json: { message: "Organization with id #{org_id} not found" }, status: :not_found
          nil
        end
      end

      def validated_limit
        limit = params[:limit]&.to_i || 10
        limit.clamp(1, 100)
      end
    end
  end
end
