module ForemanInventoryUploadHostHelper
  def hits_counts
    @hits_counts ||= InsightsHit.where(host_id: @hosts).group(:host_id).count
  end

  def hits_counts_cell(host)
    host_hits = hits_counts[host.id]
    tag.td class: ['hidden-xs', 'ellipsis', 'text-center'] do
      link_to(host_hits, "#{host_path(host)}#insights") if host_hits
    end
  end
end
