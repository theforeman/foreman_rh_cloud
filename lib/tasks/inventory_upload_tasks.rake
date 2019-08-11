require 'rake/testtask'

# Tests
namespace :test do
  desc 'Test InventoryUpload'
  Rake::TestTask.new(:inventory_upload) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :inventory_upload do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_inventory_upload) do |task|
        task.patterns = ["#{InventoryUpload::Engine.root}/app/**/*.rb",
                         "#{InventoryUpload::Engine.root}/lib/**/*.rb",
                         "#{InventoryUpload::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_inventory_upload'].invoke
  end
end

Rake::Task[:test].enhance ['test:inventory_upload']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:inventory_upload', 'inventory_upload:rubocop']
end
