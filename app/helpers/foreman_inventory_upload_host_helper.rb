module ForemanInventoryUploadHostHelper
  def hits_counts
    @hits_counts ||= InsightsHit.where(host_id: @hosts).group(:host_id).count
  end

  def hits_counts_cell(host)
    host_hits = hits_counts[host.id]
    tag.td class: ['hidden-xs', 'ellipsis', 'text-center'] do
      if host_hits
        link_to(
          host_hits,
          InsightsCloud::WebUi.system_url(InsightsCloud::WebUi::ADVISOR, host.insights.uuid),
          :rel => 'external noopener noreferrer',
          :target => '_blank'
        )
      end
    end
  end
end
