require 'rake/testtask'

# Tasks
namespace :foreman_yupana do
  namespace :example do
    desc 'Example Task'
    task task: :environment do
      # Task goes here
    end
  end
end

# Tests
namespace :test do
  desc 'Test ForemanYupana'
  Rake::TestTask.new(:foreman_yupana) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_yupana do
  task :rubocop do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_yupana) do |task|
        task.patterns = ["#{ForemanYupana::Engine.root}/app/**/*.rb",
                         "#{ForemanYupana::Engine.root}/lib/**/*.rb",
                         "#{ForemanYupana::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_yupana'].invoke
  end
end

Rake::Task[:test].enhance ['test:foreman_yupana']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_yupana', 'foreman_yupana:rubocop']
end
