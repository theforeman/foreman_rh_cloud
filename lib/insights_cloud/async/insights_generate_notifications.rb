require 'rest-client'

module InsightsCloud
  module Async
    class InsightsGenerateNotifications < ::Actions::EntryAction
      # cache blueprint on class level, so it won't be reloaded on subsequent calls
      def self.blueprint
        @blueprint ||= NotificationBlueprint.find_by(name: 'insights_satellite_hits')
      end

      def run
        add_satellite_notifications
      end

      def add_satellite_notifications
        hits_count = InsightsHit.where(host_id: foreman_host.id).count

        # Remove stale notifications
        blueprint.notifications.destroy_all

        if hits_count > 0
          add_notification(hits_count)
        end
      end

      private

      def logger
        action_logger
      end

      def foreman_host
        ForemanRhCloud.foreman_host
      end

      def blueprint
        self.class.blueprint
      end

      def add_notification(hits_count)
        Notification.create!(
          initiator: User.anonymous_admin,
          audience: ::Notification::AUDIENCE_ADMIN,
          message: UINotifications::StringParser.new(blueprint.message, {hits_count: hits_count}).to_s,
          notification_blueprint: blueprint,
          actions: {
            links: [
              {
                href: Rails.application.routes.url_helpers.foreman_rh_cloud_insights_cloud_path(search: "hostname=#{foreman_host.name}"),
                title: _('Fix host'),
              },
            ],
          }
        )
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end
    end
  end
end
