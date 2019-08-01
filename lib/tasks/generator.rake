require 'tempfile'

namespace :foreman_yupana do
  namespace :report do
    desc 'Generate yupana report to be sent to Red Hat cloud'
    task generate: :environment do
      target = ENV['target'] || ForemanYupana.facts_archive_name
      portal_user = ENV['portal_user'] || 'anonymous'

      archived_report_generator = ForemanYupana::Generators::ArchivedReport.new(target, Logger.new(STDOUT))
      archived_report_generator.render(portal_user)
      puts "Successfully generated #{target} for #{portal_user}"
    end
  end
end
