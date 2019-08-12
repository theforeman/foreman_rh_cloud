require 'rake/testtask'

# Tests
namespace :test do
  desc 'Test ForemanInventoryUpload'
  Rake::TestTask.new(:foreman_inventory_upload) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_inventory_upload do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_inventory_upload) do |task|
        task.patterns = ["#{ForemanInventoryUpload::Engine.root}/app/**/*.rb",
                         "#{ForemanInventoryUpload::Engine.root}/lib/**/*.rb",
                         "#{ForemanInventoryUpload::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_inventory_upload'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_inventory_upload']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_inventory_upload', 'foreman_inventory_upload:rubocop']
end
