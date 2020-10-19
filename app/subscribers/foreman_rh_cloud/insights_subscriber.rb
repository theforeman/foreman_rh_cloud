module ForemanRhCloud
  class InsightsSubscriber < ::Foreman::BaseSubscriber
    def call(*args)
      host = args.first.payload[:object]
      host_status = host.get_status(InsightsClientReportStatus)
      host_status.update(status: host_status.to_status)
    end
  end
end
