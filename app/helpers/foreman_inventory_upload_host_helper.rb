module ForemanInventoryUploadHostHelper
  def hits_counts
    @hits_counts ||= InsightsHit.where(host_id: @hosts).group(:host_id).count
  end

  def hits_counts_cell(host)
    host_hits = hits_counts[host.id]
    content = n_('One recommendation', '%{hits} recommendations', host_hits) % { hits: host_hits } if host_hits
    tag.td class: ['hidden-xs', 'ellipsis'] do
      if host_hits
        link_to(
          content,
          ForemanRhCloud::WebUi.insights_system_url(InsightsCloud::WebUi::ADVISOR, host.insights.uuid),
          :rel => 'external noopener noreferrer',
          :target => '_blank'
        )
      end
    end
  end
end
