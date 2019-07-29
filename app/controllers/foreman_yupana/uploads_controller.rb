module ForemanYupana
  class UploadsController < ::ApplicationController
    def last
      output = ForemanYupana::Async::ProgressOutput.get(ForemanYupana.uploader_output)&.full_output

      render json: {
        status: 'Unknown',
        output: output
      }, status: :ok
    end

    def queue
      directory = Dir["../foreman/#{ForemanYupana.uploads_folder}*"]
                  .select { |f| File.file? f }
                  .map { |f| File.basename f }

      render json: {
        queue: directory
      }, status: :ok
    end
  end
end
