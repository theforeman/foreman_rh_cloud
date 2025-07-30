module Api
  module V2
    module RhCloud
      class AdvisorEngineConfigController < ::Api::V2::BaseController
        include ::Api::Version2

        api :GET, "/rh_cloud/advisor_engine_config", N_("Show if system is configured to use local iop-advisor-engine.")
        def show
          render json: {
            use_iop_mode: ForemanRhCloud.with_iop_smart_proxy?,
          }, status: :ok
        end
      end
    end
  end
end
