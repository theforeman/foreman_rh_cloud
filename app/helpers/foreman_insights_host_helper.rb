module ForemanInsightsHostHelper
  def insights_host_overview_buttons(host)
    search_condition = "hostname=#{host.fqdn}"
    [
      {
        button: link_to_if_authorized(
          _("Recommendations"),
          hash_for_foreman_rh_cloud_insights_cloud_path(
            search: search_condition,
            select_all: true
          ),
          title: _("Host Insights recommendations"),
          class: 'btn btn-default'
        ),
        priority: 1000,
      },
    ]
  end
end
