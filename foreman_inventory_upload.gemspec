require File.expand_path('lib/foreman_inventory_upload/version', __dir__)

Gem::Specification.new do |s|
  s.name        = 'foreman_inventory_upload'
  s.version     = ForemanInventoryUpload::VERSION
  s.license     = 'GPL-3.0'
  s.authors     = ['Inventory upload team']
  s.email       = ['rlavi@redhat.com, sshtein@redhat.com']
  s.homepage    = 'https://github.com/theforeman/foreman_inventory_upload'
  s.summary     = 'Summary of ForemanInventoryUpload.'
  # also update locale/gemspec.rb
  s.description = 'Foreman plugin that process & upload data to cloud based host inventory'

  s.files = Dir['{app,config,db,lib,locale,webpack}/**/*'] +
            ['LICENSE', 'Rakefile', 'README.md'] +
            ['package.json']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'katello'
  s.add_dependency 'redhat_access'

  s.add_development_dependency 'rdoc'
  s.add_development_dependency 'rubocop', '~> 0.54.0'
end
