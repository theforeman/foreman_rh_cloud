module ForemanInsightsDeprecationsHelper
  def old_plugin_deprecation_warning
    alert(
      class: 'alert-warning',
      close: false,
      text: _('redhat_access plugin is deprecated and will be removed in Satellite 6.10. You can find recommendations for your hosts on hosts index and details pages.')
    )
  end
end
