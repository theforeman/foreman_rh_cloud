module ForemanInventoryUpload
  module Async
    module DelayedStart
      extend ActiveSupport::Concern

      START_WINDOW = 3.hours.seconds

      def after_delay(delay = nil, logger: nil, &block)
        logger ||= self.logger if respond_to? :logger
        delay ||= ForemanRhCloud.requests_delay || Random.new.rand(START_WINDOW)
        delay = delay.to_i

        logger&.debug("planning a delay for #{delay} seconds before the rest of the execution")

        sequence do
          plan_action(ForemanInventoryUpload::Async::DelayAction, delay)
          concurrence(&block)
        end
      end

      def humanized_name
        _('Wait and %s' % super)
      end
    end

    class DelayAction < ::Actions::EntryAction
      Wake = Algebrick.atom

      def plan(delay)
        plan_self(delay: delay)
      end

      def run(event = nil)
        case event
        when nil
          action_logger.debug("Going to sleep for #{sleep_seconds} seconds")
          plan_event(Wake, sleep_seconds)
          suspend
        when Wake
          action_logger.debug('Waking up')
        else
          action_logger.debug("DelayAction received unknown event #{event}")
        end
      end

      def sleep_seconds
        input[:delay].to_i
      end
    end
  end
end
