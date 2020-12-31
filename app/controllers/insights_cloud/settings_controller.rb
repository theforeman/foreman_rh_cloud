module InsightsCloud
  class SettingsController < ::ApplicationController
    def show
      render_setting(:insightsSyncEnabled, :allow_auto_insights_sync)
    end

    def update
      Setting[:allow_auto_insights_sync] = settings_params
      render_setting(:insightsSyncEnabled, :allow_auto_insights_sync)
    end

    def save_token_and_sync
      token = Setting::RhCloud.find_by_name("rh_cloud_token")
      token.value = params.require(:value)
      token.save!
      InsightsCloud::Async::InsightsFullSync.perform_now
      redirect_to(:controller => "hits", :action => 'index')
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
