# frozen_string_literal: true

module ForemanInventoryUpload
  class ReportsController < ::ApplicationController
    include InventoryUpload::ReportActions

    def generate
      organization_id = validate_organization_id
      return if performed?

      disconnected = boolean_param(:disconnected)

      task = start_report_generation(organization_id, disconnected)

      render json: {
        id: task.id,
        humanized: {
          action: task.action,
        },
      }, status: :ok
    end

    private

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

    def boolean_param(key)
      Foreman::Cast.to_bool(params[key]) || false
    end
  end
end
