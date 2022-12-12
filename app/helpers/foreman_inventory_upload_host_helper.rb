module ForemanInventoryUploadHostHelper
  def hits_counts
    @hits_counts ||= InsightsHit.where(host_id: @hosts).group(:host_id).count
  end

  def hits_counts_cell(host)
    host_hits = hits_counts[host.id]
    host_link = Setting['host_details_ui'] ? "#{host_details_page_path(host)}#/Insights" : "#{host_path(host)}#insights"
    link_to(host_hits, host_link) if host_hits
  end
end
