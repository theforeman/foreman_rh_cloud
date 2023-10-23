require 'tempfile'

namespace :rh_cloud_inventory do
  namespace :report do
    desc 'Generate inventory report and send it to Red Hat cloud'
    task generate_upload: [:environment, 'dynflow:client'] do
      unless ENV['organization_id'].nil?
        organizations = [ Organization.where(:id => ENV['organization_id']).first ]
      else
        organizations = Organization.unscoped.all
      end

      User.as_anonymous_admin do
        organizations.each do |organization|
          ForemanTasks.async_task(ForemanInventoryUpload::Async::GenerateReportJob, ForemanInventoryUpload.generated_reports_folder, organization.id)
          puts "Generated and uploaded inventory report for organization '#{organization.name}'"
        end
      end
    end
    desc 'Generate inventory report to be sent to Red Hat cloud'
    task generate: :environment do
      organizations = [ENV['organization_id']]
      base_folder = ENV['target'] || Dir.pwd

      unless File.writable?(base_folder)
        puts "#{base_folder} is not writable by the current process"
        base_folder = Dir.mktmpdir
        puts "Using #{base_folder} for the output"
      end

      if organizations.empty?
        puts "Must specify organization_id"
        return
      end

      User.as_anonymous_admin do
        organizations.each do |organization|
          target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization))
          archived_report_generator = ForemanInventoryUpload::Generators::ArchivedReport.new(target, Logger.new(STDOUT))
          archived_report_generator.render(organization: organization)
          puts "Successfully generated #{target} for organization id #{organization}"
        end
      end
    end
    desc 'Upload generated inventory report to Red Hat cloud'
    task upload: [:environment, 'dynflow:client'] do
      base_folder = ENV['target'] || ForemanInventoryUpload.generated_reports_folder
      organization_id = ENV['organization_id']
      report_file = ForemanInventoryUpload.facts_archive_name(organization_id)
      disconnected = false
      ForemanTasks.sync_task(ForemanInventoryUpload::Async::QueueForUploadJob, base_folder, report_file, organization_id, disconnected)
      puts "Uploaded #{report_file}"
    end
  end

  desc "Synchronize Hosts inventory"
  task sync: [:environment, 'dynflow:client'] do
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
