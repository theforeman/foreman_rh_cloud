require 'tempfile'

namespace :foreman_inventory_upload do
  namespace :report do
    desc 'Generate inventory report to be sent to Red Hat cloud'
    task generate: :environment do
      target = ENV['target'] || ForemanInventoryUpload.facts_archive_name
      portal_user = ENV['portal_user'] || 'anonymous'

      archived_report_generator = ForemanInventoryUpload::Generators::ArchivedReport.new(target, Logger.new(STDOUT))
      archived_report_generator.render(portal_user)
      puts "Successfully generated #{target} for #{portal_user}"
    end
  end
end
