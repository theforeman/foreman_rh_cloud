namespace :rh_cloud_insights do
  desc "Synchronize Insights hosts hits"
  task sync: [:environment, 'dynflow:client'] do
    ForemanTasks.sync_task(InsightsCloud::Async::InsightsFullSync)
    puts "Synchronized Insights hosts hits data"
  end
end
