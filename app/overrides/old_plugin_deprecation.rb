Deface::Override.new(
  virtual_path: 'redhat_access/analytics_dashboard/welcome',
  name: 'deprecation_warning',
  insert_before: 'div#welcome',
  text: '<%= old_plugin_deprecation_warning %>'
)

Deface::Override.new(
  virtual_path: 'redhat_access/analytics_dashboard/index',
  name: 'deprecation_warning_index_not_met',
  insert_before: 'article#content',
  text: '<%= old_plugin_deprecation_warning %>'
)

Deface::Override.new(
  virtual_path: 'redhat_access/analytics_dashboard/index',
  name: 'deprecation_warning_index_met',
  insert_before: 'div.main-content',
  text: '<%= old_plugin_deprecation_warning %>'
)
