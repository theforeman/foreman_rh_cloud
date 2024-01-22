blueprints = [
  {
    group: N_('Red Hat Insights'),
    name: 'insights_satellite_hits',
    message: N_('Satellite server has %{hits_count} recommendations by Red Hat'),
    level: 'warning',
  },
]

blueprints.each { |blueprint| UINotifications::Seed.new(blueprint).configure }
