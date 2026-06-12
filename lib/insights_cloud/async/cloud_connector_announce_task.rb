module InsightsCloud
  module Async
    class CloudConnectorAnnounceTask < ::Actions::EntryAction
      include ::Actions::RecurringAction
      include ::ForemanRhCloud::CertAuth

      def plan
        if ForemanRhCloud.with_iop_smart_proxy?
          logger.debug('Sources announcement skipped: running in IoP mode')
          return
        end

        if Setting[:rhc_instance_id].blank?
          logger.debug('Sources announcement skipped: rhc_instance_id is not set')
          return
        end

        unless Setting[:allow_auto_inventory_upload]
          logger.debug(
            'Cloud connector is configured (rhc_instance_id is set) but automatic inventory upload is disabled. ' \
            'Enable the "Automatic inventory upload" setting for full cloud connector functionality.'
          )
        end

        plan_self
      end

      def run
        announced = []
        skipped = []
        failed = {}

        Organization.unscoped.each do |org|
          unless cert_auth_available?(org)
            skipped << org.name
            next
          end

          presence = ForemanRhCloud::CloudPresence.new(org, logger)
          presence.announce_to_sources
          announced << org.name
        rescue StandardError => ex
          logger.warn("Failed to announce to Sources for organization #{org.name}: #{ex}")
          logger.debug { ex.backtrace.join("\n") }
          failed[org.name] = ex.message
        end

        parts = []
        parts << "Announced: #{announced.join(', ')}" if announced.any?
        parts << "Skipped (no manifest): #{skipped.join(', ')}" if skipped.any?
        if failed.any?
          failed_details = failed.map { |name, msg| "#{name}: #{msg}" }.join('; ')
          parts << "Failed: #{failed_details}"
        end
        output[:status] = parts.join('. ')

        error!("Sources announcement failed for: #{failed.keys.join(', ')}") if failed.any?
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Skip
      end

      def logger
        action_logger
      end
    end
  end
end
