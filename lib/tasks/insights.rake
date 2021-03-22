namespace :rh_cloud_insights do
  desc "Synchronize Insights inventory"
  task sync: :environment do
    if ! ENV['organization_id'].nil?
      organizations = [ Organization.where(:id => ENV['organization_id']).first ]
    else
      organizations = Organization.all
    end

    organizations.each do |organization|
      ForemanTasks.async_task(InventorySync::Async::InventoryFullSync, organization)
      puts "Synchronized inventory for organization '#{organization.name}'"
    end
  end
end
