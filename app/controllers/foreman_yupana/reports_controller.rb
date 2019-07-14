module ForemanYupana
  class ReportsController < ::ApplicationController
    def last
      output = ForemanYupana::Async::ProgressOutput.registry[:report_generator]&.full_output

      render json: {
        status: 'Unknown',
        output: output
      }, status: :ok
    end
  end
end
