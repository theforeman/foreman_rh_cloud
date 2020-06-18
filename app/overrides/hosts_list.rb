Deface::Override.new(
  virtual_path: 'hosts/_list',
  name: 'insights_hits_header',
  insert_before: 'thead tr th.hidden-xs:first-of-type',
  text: '<th class="hidden-xs" width="10%"><%= _("Insights")%></th>'
)

Deface::Override.new(
  virtual_path: 'hosts/_list',
  name: 'insights_hits_cells',
  insert_before: 'tbody tr td.hidden-xs:first-of-type',
  text: '<%= hits_counts_cell(host) %>'
)
