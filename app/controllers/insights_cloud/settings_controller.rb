module InsightsCloud
  class SettingsController < ::ApplicationController
    def show
      render_setting(:insightsSyncEnabled, :allow_auto_insights_sync)
    end

    def update
      Setting[:allow_auto_insights_sync] = settings_params
      render_setting(:insightsSyncEnabled, :allow_auto_insights_sync)
    end

    private

    def render_setting(node_name, setting)
      render json: {
        node_name => Setting[setting],
      }
    end

    def settings_params
      ActiveModel::Type::Boolean.new.cast(params.require(:insightsSyncEnabled))
    end
  end
end
