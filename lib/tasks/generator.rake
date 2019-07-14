require 'tempfile'
require 'foreman_yupana/report/generator'

namespace :foreman_yupana do
  namespace :report do
    desc 'Generate yupana report to be sent to Red Hat cloud'
    task generate: :environment do
      target = ENV['target'] || 'hosts_report.tar.gz'
      Tempfile.create('inventory_report') do |output|
        puts 'Started generating hosts report'
        generator = ForemanYupana::Report::Generator.new(output)
        generator.render
        output.close
        puts 'Report generation finished'

        puts 'Archiving generated report'
        system('tar', '-zcvf', target, output.path)
        puts 'Report archived successfully'
      end
    end
  end
end
