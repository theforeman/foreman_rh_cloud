require 'tempfile'

namespace :rh_cloud_inventory do
  namespace :report do
    desc 'Generate inventory report and send it to Red Hat cloud'
    task generate_upload: [:environment, 'dynflow:client'] do
      if ENV['organization_id'].nil?
        organizations = Organization.unscoped.all
      else
        organizations = [Organization.where(:id => ENV['organization_id']).first]
      end
      User.as_anonymous_admin do
        organizations.each do |organization|
          ForemanTasks.async_task(
            ForemanInventoryUpload::Async::HostInventoryReportJob,
            ForemanInventoryUpload.generated_reports_folder,
            organization.id,
            '', # hosts_filter
            true # upload
          )
          puts "Generated and uploaded inventory report for organization '#{organization.name}'"
        end
      end
    end
    desc 'Generate inventory report to be sent to Red Hat cloud'
    task generate: [:environment, 'dynflow:client'] do
      organization_ids = [ENV['organization_id']]
      base_folder = ENV['target'] || Dir.pwd
      filter = ENV['hosts_filter']

      unless File.writable?(base_folder)
        puts "#{base_folder} is not writable by the current process"
        base_folder = Dir.mktmpdir
        puts "Using #{base_folder} for the output"
      end

      if organization_ids.empty?
        puts "Must specify organization_id"
        return
      end

      User.as_anonymous_admin do
        organization_ids.each do |organization_id|
          task = ForemanTasks.sync_task(
            ForemanInventoryUpload::Async::HostInventoryReportJob,
            base_folder,
            organization_id,
            filter,
            false # don't upload; the user ran report:generate and not report:generate_upload
          )

          if task.result == 'success'
            if ForemanInventoryUpload.active_storage?
              report = ForemanInventoryUpload::Report.where(organization_id: organization_id).find(task.execution_plan_action.output[:report_id])
              target_file = File.join(base_folder, report.filename)
              ForemanInventoryUpload::LegacyArchiveLock.synchronize(shared: true) do
                report.archive.open { |file| FileUtils.cp(file.path, target_file) }
              end
            end
            unless Setting[:subscription_connection_enabled]
              target_file = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization_id, filter))
              puts "Generated #{target_file} for organization id #{organization_id}"
            end
          else
            puts "Failed to generate report for organization id #{organization_id}. Task result: #{task.result}"
            puts "Check task #{task.id} in the Tasks dashboard for error details."
          end
        end
        puts "Check the Uploading tab for report uploading status." if Setting[:subscription_connection_enabled]
      end
    end
    desc 'Upload generated inventory report to Red Hat cloud'
    task upload: [:environment, 'dynflow:client'] do
      base_folder = ENV['target'] || ForemanInventoryUpload.generated_reports_folder
      organization_id = ENV['organization_id']
      report_file = ForemanInventoryUpload.facts_archive_name(organization_id)
      report = ForemanInventoryUpload::Report.where(organization_id: organization_id, filename: report_file).latest_first.first if ForemanInventoryUpload.active_storage? && !ENV['target']
      if report&.archive&.attached?
        ForemanTasks.sync_task(ForemanInventoryUpload::Async::QueueForUploadJob, report.id, organization_id)
      else
        ForemanTasks.sync_task(ForemanInventoryUpload::Async::QueueForUploadJob, base_folder, report_file, organization_id)
      end
      puts "Uploaded #{report_file}"
    end
  end

  desc "Synchronize Hosts inventory"
  task sync: [:environment, 'dynflow:client'] do
    if !ENV['organization_id'].nil?
      organizations = [Organization.where(:id => ENV['organization_id']).first]
    else
      organizations = Organization.all
    end

    organizations.each do |organization|
      ForemanTasks.async_task(InventorySync::Async::InventoryFullSync, organization)
      puts "Synchronized inventory for organization '#{organization.name}'"
    end
  end
end
