module ForemanRhCloud
  class InsightsStatusCleaner
    def clean(host_search)
      host_ids = Host.search_for(host_search).pluck(:id)

      # delete all insights status records for the hosts
      deleted_count = InsightsClientReportStatus.where(host_id: host_ids).delete_all

      # refresh global status
      Host.where(id: host_ids).preload(:host_statuses).find_in_batches do |hosts|
        hosts.each { |host| host.refresh_global_status! }
      end

      deleted_count
    end
  end
end
