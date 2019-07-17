module ForemanYupana
  module Async
    class GenerateReportJob < ShellProcess
      def perform(output_label, result_file)
        @result_file = result_file

        super(output_label)

        QueueForUploadJob.perform_async(result_file)
      end

      def command
        'rake foreman_yupana:report:generate'
      end

      def env
        super.merge(
          'target' => @result_file
        )
      end
    end
  end
end
