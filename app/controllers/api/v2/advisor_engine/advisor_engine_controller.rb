module Api
  module V2
    module AdvisorEngine
      class AdvisorEngineController < ::Api::V2::BaseController
        include ::Api::Version2
        include Foreman::Controller::SmartProxyAuth

        add_smart_proxy_filters [:host_details]

        api :GET, "/advisor_engine/host_details", N_('Fetch Insights-related host details')
        param :host_uuids, Array, required: true, desc: N_('List of host UUIDs')
        def host_details
          uuids = params.require(:host_uuids)
          @hosts = ::Host.joins(:insights).where(:insights => { :uuid => uuids })
          if @hosts.empty?
            render json: { error: 'No hosts found for the given UUIDs' }, status: :not_found
          else
            respond_to do |format|
              format.json { render 'api/v2/advisor_engine/host_details' }
            end
          end
        end
      end
    end
  end
end
