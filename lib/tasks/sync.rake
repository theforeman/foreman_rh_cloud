namespace :foreman_rh_cloud do
  namespace :sync do
    desc "Synchronize Insights hosts hits"
    task insights: :environment do
      InsightsCloud::Async::InsightsFullSync.perform_now()
      puts "Synchronized Insights hosts hits data"
    end

    desc "Synchronize Insights inventory"
    task inventory: :environment do
      if ! ENV['organization_id'].nil?
        organizations = [ Organization.where(:id => ENV['organization_id']).first ]
      else
        organizations = Organization.all
      end

      organizations.each do |organization|
        InventorySync::Async::InventoryFullSync.perform_now(organization)
        puts "Synchronized inventory for organization '#{organization.name}'"
      end
    end
  end
end
