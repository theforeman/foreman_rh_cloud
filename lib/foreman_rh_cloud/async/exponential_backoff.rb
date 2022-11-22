module ForemanRhCloud
  module Async
    module ExponentialBackoff
      extend ActiveSupport::Concern
      include Dynflow::Action::Polling

      # Use each interval once
      def attempts_before_next_interval
        1
      end

      # define poll intervals in the following way: [1/10..1, 1..10, 10..100] e.t.c.
      # total count of intervals would be the amount of poll retries.
      def poll_intervals
        (1..poll_max_retries).map do |i|
          base = 10**i
          random_interval(base)
        end
      end

      def done!
        @done = true
      end

      def done?
        @done
      end

      def invoke_external_task
        # Call the polling method from task's framework
        poll_external_task_with_rescue
        # supress unexpected task output serialization
        {}
      end

      def poll_external_task
        try_execute
        # supress unexpected task output serialization
        {}
      end

      # override this method in the consumng class
      # This is the action that we expect to retry in case of an exception.
      def try_execute
        raise NotImplementedError
      end

      private

      def random_interval(base)
        Random.new.rand(base..10 * base)
      end
    end
  end
end
