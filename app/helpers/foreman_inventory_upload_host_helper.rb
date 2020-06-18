module ForemanInventoryUploadHostHelper
  def hits_counts
    @hits_counts ||= InsightsHit.where(host_id: @hosts).group(:host_id).count
  end

  def hits_counts_cell(host)
    host_hits = hits_counts[host.id]
    content = n_('One recommendation', '%{hits} recommendations', host_hits) % { hits: host_hits } if host_hits
    tag.td content, class: ['hidden-xs', 'ellipsis']
  end
end
