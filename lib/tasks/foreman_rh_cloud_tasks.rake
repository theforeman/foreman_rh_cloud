require 'rake/testtask'

# Tests
namespace :test do
  desc 'Test ForemanRhCloud'
  Rake::TestTask.new(:foreman_rh_cloud) do |t|
    test_dir = File.join(File.dirname(__FILE__), '../..', 'test')
    t.libs << ['test', test_dir]
    t.pattern = "#{test_dir}/**/*_test.rb"
    t.verbose = true
    t.warning = false
  end
end

namespace :foreman_rh_cloud do
  task :rubocop => :environment do
    begin
      require 'rubocop/rake_task'
      RuboCop::RakeTask.new(:rubocop_foreman_rh_cloud) do |task|
        task.patterns = ["#{ForemanRhCloud::Engine.root}/app/**/*.rb",
                         "#{ForemanRhCloud::Engine.root}/lib/**/*.rb",
                         "#{ForemanRhCloud::Engine.root}/test/**/*.rb"]
      end
    rescue
      puts 'Rubocop not loaded.'
    end

    Rake::Task['rubocop_foreman_rh_cloud'].invoke
  end
end

namespace :foreman_rh_cloud do
  desc 'Install IOP API documentation assets'
  task :install_iop_apidoc => :environment do
    require 'fileutils'

    engine_root = ForemanRhCloud::Engine.root
    target = engine_root.join('public', 'apidoc', 'iop')
    swagger_dist = engine_root.join('node_modules', 'swagger-ui-dist')
    template_dir = engine_root.join('app', 'views', 'apidoc', 'iop')

    FileUtils.mkdir_p(target)

    # Copy swagger-ui dist files
    %w[swagger-ui-bundle.js swagger-ui-standalone-preset.js swagger-ui.css].each do |file|
      FileUtils.cp(swagger_dist.join(file), target.join(file))
    end

    # Copy HTML template
    FileUtils.cp(template_dir.join('index.html'), target.join('index.html'))

    puts "IOP API docs installed to #{target}"
  end
end

Rake::Task[:test].enhance ['test:foreman_rh_cloud']

load 'tasks/jenkins.rake'
if Rake::Task.task_defined?(:'jenkins:unit')
  Rake::Task['jenkins:unit'].enhance ['test:foreman_rh_cloud', 'foreman_rh_cloud:rubocop']
end
